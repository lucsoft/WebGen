import { alwaysRef, asWebGenComponent, Box, Color, css, HTMLComponent, Label, Refable, WriteSignal } from "../../core/mod.ts";

@asWebGenComponent("input")
class InputComponent extends HTMLComponent {
    #inputBg = new Color("var(--wg-input-background-color, var(--wg-primary))");
    #input = document.createElement("input");
    constructor(type: string, value: WriteSignal<string>, label: Refable<string | undefined>, valueChangeMode: "change" | "input" = "input") {
        super();
        this.#input.type = type;
        this.shadowRoot!.append(Box(alwaysRef(label).map(placeholder => placeholder ? Label(placeholder) : [])).addClass("label").draw(), this.#input);

        this.useListener(alwaysRef(label), (text) => {
            if (text) {
                this.ariaLabel = text;
            } else {
                this.ariaLabel = null;
            }
        });


        this.useEventListener(this.#input, "input", () => {
            if (this.#input.value === "") {
                this.removeAttribute("has-value");
            } else {
                this.setAttribute("has-value", "");
            }
        });

        this.useEventListener(this.#input, valueChangeMode, () => {
            value.value = this.#input.value;
        });

        this.useListener(value, (newValue) => {
            this.#input.value = newValue;
            if (newValue) {
                this.setAttribute("has-value", "");
            } else {
                this.removeAttribute("has-value");
            }
        });

        this.shadowRoot!.adoptedStyleSheets.push(css`
            :host {
                display: grid;
                height: var(--wg-input-height, 36px);
                border-radius: var(--wg-input-box-shadow, var(--wg-radius-tiny));
                background-color: ${this.#inputBg.mix(Color.transparent, 95)};
                color: ${this.#inputBg.toString()};
                padding: var(--wg-button-padding, 0 10px);
                border: 2px solid;
                align-items: center;
            }
            :host > * {
                grid-row: 1;
                grid-column: 1;
                transition: all 200ms ease;
            }
            input {
                all: unset;
                font-size: var(--wg-input-font-size, 12px);
            }
            :host([has-value]) .label,
            :host(:focus-within) .label {
                font-size: var(--wg-label-font-size, 8px);
                font-weight: var(--wg-input-font-weight, bold);
                margin-bottom: 17px;
            }
            :host([has-value][aria-label]) input,
            :host([aria-label]) input:focus-within {
                margin-top: 11px;
            }
        `);
    }
}

export function TextInput(value: WriteSignal<string>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("text", value, label, valueChangeMode).make();
}

export function EmailInput(value: WriteSignal<string>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("email", value, label, valueChangeMode).make();
}

export function PasswordInput(value: WriteSignal<string>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("password", value, label, valueChangeMode).make();
}
