import { asWebGenComponent, css, HTMLComponent, WriteSignal, type Component } from "../../core/mod.ts";
import { asRef } from "../../core/state.ts";

@asWebGenComponent("dialog-container")
export class DialogContainerComponent extends HTMLComponent {
    #dialog = document.createElement("dialog");
    #shouldCloseItself = asRef((): boolean => true);
    constructor(isOpen: WriteSignal<boolean>, component: Component) {
        super();
        this.#dialog.append(component.draw());
        this.shadowRoot!.append(this.#dialog);
        this.shadowRoot?.adoptedStyleSheets.push(css`
            :host {
                display: contents;
            }
            dialog {
                border: none;
                padding: unset;
                max-width: 100%;
                max-height: 100%;
                background: transparent;
                outline: none;
                box-sizing: border-box;
            }
            :host([full-screen]) dialog {
                width: unset;
                height: unset;
            }
            :host([no-overflow]) dialog {
                overflow: unset;
            }
            dialog::backdrop {
                background: rgba(0, 0, 0, 30%);
            }
        `);
        isOpen.listen((open) => {
            if (open === this.#dialog.open) return;
            if (open) {
                this.#dialog.showModal();
            } else {
                this.#dialog.close();
            }
        });
        this.#dialog.addEventListener("click", (event) => {
            if (!this.#shouldCloseItself.value()) {
                return;
            }
            if (event.target == this.#dialog) {
                isOpen.value = false;
            }
        });
        this.#dialog.addEventListener("close", (event) => {
            if (!this.#shouldCloseItself.value()) {
                event.preventDefault();
                return;
            }
            isOpen.value = false;
        });
    }

    override make() {
        const obj = {
            ...super.make(),
            setShouldCloseItself: (callback: () => boolean) => {
                this.#shouldCloseItself.value = () => callback();
                return obj;
            }
        };
        return obj;
    }
}

export function DialogContainer(isOpen: WriteSignal<boolean>, component: Component) {
    return new DialogContainerComponent(isOpen, component).make();
}
