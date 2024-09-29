import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { asRef, Reference } from "../state.ts";
import { Box } from "./box.ts";

@asWebGenComponent("list")
export class ListComponent<Data> extends HTMLComponent {

    constructor(source: Reference<Data[]>, itemHeight: number, renderItem: (data: Data, index: number) => Component) {
        super();

        this.style.display = "grid";
        this.style.gridTemplate = "100% / 100%";

        const windowHeight = asRef(300);
        const scrollTop = asRef(0);
        const innerHeight = source.map(it => it.length * itemHeight);
        const startIndex = scrollTop.map(scrollTop => Math.floor(scrollTop / itemHeight));
        const endIndex = scrollTop.map(scrollTop => Math.min(
            source.value.length - 1, // don't render past the end of the list
            Math.floor((scrollTop + windowHeight.value) / itemHeight)
        ));

        const renderingItem = asRef<Component>(Box(asRef([])));

        this.addListen(() => {
            const items: Component[] = [];
            for (let i = startIndex.value; i <= endIndex.value; i++) {
                const item = renderItem(source.value[ i ], i).draw();
                item.style.position = "absolute";
                item.style.top = `${i * itemHeight}px`;
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
        this.style.height = "100%";

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
}

export function List<Data>(source: Reference<Data[]>, itemHeight: number, renderItem: (data: Data, index: number) => Component) {
    return new ListComponent(source, itemHeight, renderItem).make();
}