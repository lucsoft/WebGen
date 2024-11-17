import { asWebGenComponent, css, HTMLComponent, Reference, WriteSignal } from "../../core/mod.ts";
import { alwaysRef, asRef, Refable } from "../../core/state.ts";

@asWebGenComponent("inline-input")
class InlineInputComponent extends HTMLComponent {
    input = document.createElement("input");
    #focused = asRef(false);

    constructor(value: WriteSignal<string>, placeholder: Reference<string>) {
        super();
        this.shadowRoot!.append(this.input);

        this.input.placeholder = placeholder.value;

        this.input.addEventListener("input", () => {
            value.value = this.input.value;
        });

        this.shadowRoot!.adoptedStyleSheets.push(css`
            input {
                background-color: transparent;
                border: none;
                outline: none;
                color: inherit;
                font-size: inherit;
                width: 100%;
            }
            input::placeholder {
                color: inherit;
            }
        `);

        this.useListener(this.#focused, focused => {
            if (focused) {
                this.input.focus();
            }
        });

        this.useListener(value, value => {
            this.input.value = value;
        });
        this.addEventListener("blur", () => {
            this.#focused.value = false;
        });

    }

    override make() {
        const obj = {
            ...super.make(),
            focusedState: () => {
                return this.#focused;
            }
        };
        return obj;
    }
}

export function InlineInput(value: WriteSignal<string>, placeholder: Refable<string>) {
    return new InlineInputComponent(value, alwaysRef(placeholder)).make();
}