import { alwaysRef, asRef, asWebGenComponent, Color, css, HTMLComponent, WriteSignal, type Refable } from "../../core/mod.ts";
import { MaterialIcon } from "../icons.ts";

export type CheckboxValue = boolean | 'intermediate';

@asWebGenComponent("checkbox")
export class CheckboxComponent extends HTMLComponent {
    #disabled = asRef(false);
    #inputBg = new Color("var(--wg-checkbox-background-color, var(--wg-primary))");
    #input = document.createElement("input");
    constructor(mode: WriteSignal<CheckboxValue>) {
        super();

        this.#input.type = "checkbox";

        const iconContainer = document.createElement("div");
        this.shadowRoot?.append(iconContainer);
        this.shadowRoot?.append(this.#input);

        this.useListener(mode, (checked) => {
            this.#input.checked = checked === true;
            this.#input.indeterminate = checked === 'intermediate';
            if (checked)
                this.setAttribute("checked", String(checked));
            else
                this.removeAttribute("checked");
        });

        iconContainer.append(MaterialIcon(mode.map(mode => {
            if (mode === true) return "check_small";
            if (mode === "intermediate") return "check_indeterminate_small";
            return "";
        })).draw());

        this.useEventListener(this.#input, "change", () => {
            mode.value = this.#input.checked;
        });

        this.useListener(this.#disabled, (disabled) => {
            this.#input.disabled = disabled;
            if (disabled)
                this.setAttribute("disabled", "");
            else
                this.removeAttribute("disabled");
        });

        this.shadowRoot?.adoptedStyleSheets.push(css`
            :host {
                display: grid;
                background-color: ${this.#inputBg.mix(Color.transparent, 95)};
                width: var(--wg-checkbox-size, 25px);
                height: var(--wg-checkbox-size, 25px);
                grid-template: 100% / 100%;
                transition: all 250ms ease;
                color: var(--wg-primary-text);
                border-radius: var(--wg-checkbox-border-radius, var(--wg-radius-tiny));
                user-select: none;
            }
            :host(:focus-within),
            :host(:hover) {
                background-color: ${this.#inputBg.mix(Color.transparent, 85)};
            }
            :host(:hover) {
                transform: translate(0, -2px);
            }

            :host([checked]:focus-within),
            :host([checked]:hover) {
                outline: 5px solid ${this.#inputBg.mix(Color.transparent, 50)};
            }

            :host(:active) {
                transform: translate(0, 0);
            }
            :host([checked]:active) {
                outline: 3px solid ${this.#inputBg.mix(Color.transparent, 50)};
            }
            :host([checked]) {
                background-color: ${this.#inputBg.toString()};
            }

            :host([disabled]) {
                background-color: var(--wg-checkbox-disabled-color, hsl(0deg 0% 20%));
                color: var(--wg-checkbox-disabled-text-color, hsl(0deg 0% 40%));
                transform: none;
            }

            input {
                appearance: none;
                outline: none;
                margin: -5px;
            }
            * {
                grid-area: 1 / 1;
            }
            div {
                display: grid;
                place-items: center;
                pointer-events: none;
            }

            :host(:not([disabled])) input {
                cursor: pointer;
            }
        `);
    }

    override make() {
        const obj = {
            ...super.make(),
            onClick: (action: (event: Event) => void) => {
                this.useEventListener(this.#input, "click", action);
                return obj;
            },
            setDisabled: (disabled: Refable<boolean> = true) => {
                this.useListener(alwaysRef(disabled), (newDisabled) => {
                    this.#disabled.value = newDisabled;
                });
                return obj;
            },
        };
        return obj;
    }
}

export function Checkbox(mode: WriteSignal<CheckboxValue>) {
    return new CheckboxComponent(mode).make();
}