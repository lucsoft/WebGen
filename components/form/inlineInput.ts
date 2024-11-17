import { asWebGenComponent, css, HTMLComponent, Reference, WriteSignal } from "../../core/mod.ts";
import { alwaysRef, Refable } from "../../core/state.ts";

@asWebGenComponent("inline-input")
class InlineInputComponent extends HTMLComponent {
    constructor(value: WriteSignal<string>, placeholder: Reference<string>) {
        super();
        const input = document.createElement("input");
        this.shadowRoot!.append(input);

        input.value = value.value;
        input.placeholder = placeholder.value;

        input.addEventListener("input", () => {
            value.value = input.value;
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
    }
}

export function InlineInput(value: WriteSignal<string>, placeholder: Refable<string>) {
    return new InlineInputComponent(value, alwaysRef(placeholder)).make();
}