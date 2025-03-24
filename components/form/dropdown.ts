import { alwaysRef, asRef, asWebGenComponent, Component, css, HTMLComponent, Refable, Reference, WriteSignal } from "../../core/mod.ts";
import { MaterialIcon } from "../icons.ts";
import { SearchEngine } from "../menu.ts";
import { Menu } from "../mod.ts";
import { TextInput } from "./input.ts";

@asWebGenComponent("dropdown")
class DropDownComponent extends HTMLComponent {
    #disabled = asRef(false);
    #invalid = asRef(false);
    #valueRender = asRef((value: string) => value);
    #menu: ReturnType<typeof Menu>;

    constructor(dropdown: Reference<string[]>, selectedItem: Reference<string | undefined>, label: Reference<string>) {
        super();
        let isOpen = false;
        this.#menu = Menu(dropdown)
            .setValueRenderer(this.#valueRender)
            .onItemClick((item) => {
                selectedItem.value = item;
                this.#menu.draw().hidePopover();
            });
        this.useEventListener(this.#menu.draw(), "toggle", (event) => {
            isOpen = (<ToggleEvent>event).newState === "open";
        });
        this.#menu.setAttribute("popover", "");

        const texbox = TextInput(selectedItem.map(item => item === undefined ? label.value : this.#valueRender.value(item)) as WriteSignal<string>, selectedItem.map(item => item === undefined ? "" : label.value))
            .setReadOnly()
            .addSuffix(MaterialIcon(this.#menu.focusedState().map(open => open ? "arrow_drop_up" : "arrow_drop_down")).setCssStyle("gridColumn", "3"))
            .onClick(() => {
                if (this.#disabled.value) return;
                if (isOpen)
                    return this.#menu.draw().hidePopover();
                this.#menu.clearSearch();
                this.#menu.draw().showPopover();
                this.#menu.focusedState().value = true;
            })
            .draw();

        this.useEventListener(texbox, "keyup", (event) => {
            if (this.#disabled.value) return;
            if ((event as KeyboardEvent).key === "Enter") {
                if (isOpen)
                    return this.#menu.draw().hidePopover();
                this.#menu.clearSearch();
                this.#menu.draw().showPopover();
                this.#menu.focusedState().value = true;
            }
        });

        this.shadowRoot!.append(
            texbox,
            this.#menu.draw()
        );

        this.shadowRoot!.adoptedStyleSheets.push(css`
            :host {
                position: relative;
            }
            wg-input {
                anchor-name: --anchor-dropdown;
            }
            wg-menu {
                position: fixed;
                inset: unset;
                overflow: unset;
                bottom: 1.5rem;
                padding: 0;
                background: none;
                border: none;
                width: auto;
                height: auto;
                position-anchor: --anchor-dropdown;
                top: anchor(bottom);
                left: anchor(left);
            }
        `);
    }

    override make() {
        const obj = {
            ...super.make(),
            setValueRender: (valueRender: (value: string) => string) => {
                this.#valueRender.value = valueRender;
                return obj;
            },
            setSearchEngine: (searchEngine: SearchEngine) => {
                this.#menu.setSearchEngine(searchEngine);
                return obj;
            },
            setDisabled: (disabled: boolean) => {
                this.#disabled.value = disabled;
                return obj;
            },
            setInvalid: (invalid: boolean) => {
                this.#invalid.value = invalid;
                return obj;
            },
            addAction: (title: Refable<string>, icon: Component, onClick: () => void) => {
                this.#menu.addAction(title, icon, onClick);
                return obj;
            }
        };
        return obj;
    }
}

export function DropDown(dropdown: Refable<string[]>, selectedItem: Reference<string | undefined>, label: Refable<string> = "") {
    return new DropDownComponent(alwaysRef(dropdown), selectedItem, alwaysRef(label)).make();
}
