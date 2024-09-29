import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { alwaysRef, asRef, Refable, Reference } from "../state.ts";
import { Box } from "./box.ts";

@asWebGenComponent("list")
export class ListComponent<Data> extends HTMLComponent {
    #gap = asRef(0);
    constructor(source: Reference<Data[]>, itemHeight: number, renderItem: (data: Data, index: number) => Component) {
        super();

        this.style.display = "grid";
        this.style.gridTemplate = "100% / 100%";

        const windowHeight = asRef(300);
        const scrollTop = asRef(0);
        const realItemHeight = this.#gap.map(gap => itemHeight + gap);
        const innerHeight = source.map(it => it.length * realItemHeight.value + this.#gap.value);
        const startIndex = scrollTop.map(scrollTop => Math.floor(scrollTop / realItemHeight.value));
        const endIndex = scrollTop.map(scrollTop => Math.min(
            source.value.length - 1, // don't render past the end of the list
            Math.floor((scrollTop + windowHeight.value) / realItemHeight.value)
        ));

        const renderingItem = asRef<Component>(Box(asRef([])));

        this.addListen(() => {
            const items: Component[] = [];
            for (let i = startIndex.value; i <= endIndex.value; i++) {
                const item = renderItem(source.value[ i ], i).draw();
                item.style.position = "absolute";
                item.style.top = `${i * realItemHeight.value + (this.#gap.value / 2)}px`;
                item.style.width = "100%";
                item.style.boxSizing = "border-box";
                item.style.height = `${itemHeight}px`;
                items.push({ draw: () => item });
            }

            const inner = Box(asRef(items)).addClass("inner").draw();
            inner.style.position = "relative";
            inner.style.height = `${innerHeight.value}px`;
            inner.style.display = "block";
            renderingItem.setValue({ draw: () => inner });
        });


        this.style.overflowY = "auto";

        this.useEventListener(this, "scroll", () => {
            scrollTop.setValue(this.scrollTop);
        });

        this.addWatch(() => {
            const res = new ResizeObserver(() => {
                windowHeight.setValue(this.clientHeight);
            });

            res.observe(this);

            return {
                unlisten: () => {
                    res.disconnect();
                }
            };
        });


        this.useListener(renderingItem, (newValue, oldValue) => {
            if (oldValue) {
                this.shadowRoot!.removeChild(oldValue.draw());
            }
            this.shadowRoot!.append(newValue.draw());
        });
    }

    make() {
        const obj = {
            ...super.make(),
            setGap: (gap: Refable<number>) => {
                this.useListener(alwaysRef(gap), (newValue) => {
                    this.#gap.value = newValue;
                    this.style.margin = `0 calc(0px - ${newValue}px)`;
                    this.style.padding = `0 ${newValue}px`;
                });
                return obj;
            }
        };
        return obj;
    }
}

export function List<Data>(source: Reference<Data[]>, itemHeight: number, renderItem: (data: Data, index: number) => Component) {
    return new ListComponent(source, itemHeight, renderItem).make();
}