import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { asRef } from "../state.ts";

@asWebGenComponent("popover")
export class PopoverComponent extends HTMLComponent {
    #requestedOpen = asRef(false);
    #open = asRef(false);
    constructor(content: Component) {
        super();
        this.setAttribute("popover", "");
        this.shadowRoot!.append(content.draw());
        this.addEventListener("toggle", (event) => {
            this.#open.setValue((<ToggleEvent>event).newState === "open");
        });
    }

    override make() {
        const obj = {
            ...super.make(),
            showPopover: () => {
                try {
                    this.showPopover();
                    this.#requestedOpen.value = true;
                } catch {
                    //
                }
                return obj;
            },
            hidePopover: () => {
                try {
                    this.hidePopover();
                    this.#requestedOpen.value = false;
                } catch {
                    //
                }
                return obj;
            },
            togglePopover: (force: boolean) => {
                try {
                    this.togglePopover(force);
                    this.#requestedOpen.value = !this.#requestedOpen.value;
                } catch {
                    //
                }
                return obj;
            },
            isOpen: () => {
                return this.#open.getValue();
            },
        };
        return obj;
    }
}

export function Popover(content: Component) {
    return new PopoverComponent(content).make();
}