import { alwaysRef, asWebGenComponent, Box, Color, css, HTMLComponent, Label, Refable, WriteSignal } from "../../core/mod.ts";
import { asRef } from "../../core/state.ts";

@asWebGenComponent("input")
class InputComponent extends HTMLComponent {
    #inputBg = new Color("var(--wg-input-background-color, var(--wg-primary))");
    #input = document.createElement("input");
    #disabled = asRef(false);
    #readOnly = asRef(false);
    #invalid = asRef(false);

    constructor(type: string, value: WriteSignal<string | undefined>, label: Refable<string | undefined>, valueChangeMode: "change" | "input" = "input") {
        super();
        if (type === "text-area") {
            this.#input = document.createElement("textarea") as HTMLElement as HTMLInputElement;
            this.setAttribute("text-area", "");
        } else {
            this.#input.type = type;
        }
        this.#input.classList.add("input");
        this.shadowRoot!.append(Box(alwaysRef(label).map(placeholder => placeholder ? Label(placeholder) : [])).addClass("label").draw(), this.#input);

        this.useListener(alwaysRef(label), (text) => {
            if (text) {
                this.ariaLabel = text;
            } else {
                this.ariaLabel = null;
            }
        });

        this.useListener(this.#disabled, (disabled) => {
            this.#input.disabled = disabled;
            if (disabled) {
                this.setAttribute("disabled", "");
            } else {
                this.removeAttribute("disabled");
            }
        });

        this.useListener(this.#invalid, (invalid) => {
            if (invalid) {
                this.#input.setCustomValidity("Invalid");
                this.setAttribute("invalid", "");
            } else {
                this.#input.setCustomValidity("");
                this.removeAttribute("invalid");
            }
        });

        this.useListener(this.#readOnly, (readOnly) => {
            this.#input.readOnly = readOnly;
            if (readOnly) {
                this.setAttribute("readonly", "");
            } else {
                this.removeAttribute("readonly");
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
            value.value = this.#input.value || undefined;
        });

        this.useListener(value, (newValue) => {
            this.#input.value = newValue ?? "";
            if (newValue) {
                this.setAttribute("has-value", "");
            } else {
                this.removeAttribute("has-value");
            }
        });

        this.shadowRoot!.adoptedStyleSheets.push(css`
            :host {
                display: grid;
                grid-template-columns: auto;
                grid-auto-columns: max-content;
                min-height: var(--wg-input-height, 50px);
                background-color: ${this.#inputBg.mix(Color.transparent, 95)};
                color: ${this.#inputBg.toString()};
                padding: var(--wg-button-padding, 0 10px);
                border-radius: var(--wg-input-border-radius, var(--wg-radius-tiny));
                border-bottom: 1px solid;
                align-items: center;
            }
            .input {
                all: unset;
                font-size: var(--wg-input-font-size, 15px);
                z-index: 1;
                opacity: 0;
                min-width: 0px;
            }
            :host(:not([aria-label])) .input {
                opacity: unset;
            }
            textarea.input {
                height: 120px;
                margin-top: 12px;
                opacity: 1;
            }
            :host > * {
                grid-row: 1;
                grid-column: 1;
                transition: all 200ms ease;
                width: 100%;
            }
            .label {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: block;
            }
            :host([has-value]) .label,
            :host(:focus-within) .label {
                font-size: var(--wg-label-font-size, 10px);
                font-weight: var(--wg-input-font-weight, bold);
                margin-bottom: 20px;
            }
            :host([text-area]) .label {
                margin-bottom: 110px;
            }
            :host([has-value][aria-label]) .input,
            :host([aria-label]) .input:focus-within {
                margin-top: 14px;
                opacity: 1;
            }

            :host([text-area][aria-label]) textarea.input {
                margin-top: 25px;
            }

            :host([readonly]:focus-within),
            :host([has-value]:focus-within) {
                background-color: ${this.#inputBg.mix(Color.transparent, 90)};
                border-bottom: 2px solid;
                margin-bottom: -1px;
            }

            :host([invalid]) {
                background: var(--wg-button-invalid-color, hsl(0deg 40% 18%));
                color: var(--wg-button-invalid-color, hsl(0deg 90% 70%));
            }

            :host([disabled]) {
                background: var(--wg-button-disabled-color, hsl(0deg 0% 18%));
                color: var(--wg-button-disabled-text-color, hsl(0deg 0% 50%));
                border-bottom: 0px solid;
                margin-bottom: 1px;
            }
        `);
    }

    override make() {
        const obj = {
            ...super.make(),
            setDisabled: (disabled: Refable<boolean> = true) => {
                this.useListener(alwaysRef(disabled), (disabled) => {
                    this.#disabled.value = disabled;
                });
                return obj;
            },
            onFocus: (callback: () => void) => {
                this.useEventListener(this.#input, "focus", callback);
                return obj;
            },
            setReadOnly: (readOnly: Refable<boolean> = true) => {
                this.useListener(alwaysRef(readOnly), (readOnly) => {
                    this.#readOnly.value = readOnly;
                });
                return obj;
            },
            setInvalid: (invalid: Refable<boolean> = true) => {
                this.useListener(alwaysRef(invalid), (invalid) => {
                    this.#invalid.value = invalid;
                });
                return obj;
            }
        };
        return obj;
    }
}

export function TextInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("text", value, label, valueChangeMode).make();
}

export function EmailInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("email", value, label, valueChangeMode).make();
}

export function PasswordInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("password", value, label, valueChangeMode).make();
}

export function DateInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("date", value, label, valueChangeMode).make();
}

export function DateTimeInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("datetime-local", value, label, valueChangeMode).make();
}

export function TimeInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("time", value, label, valueChangeMode).make();
}

export function TextAreaInput(value: WriteSignal<string | undefined>, label: Refable<string | undefined> = undefined, valueChangeMode: "change" | "input" = "input") {
    return new InputComponent("text-area", value, label, valueChangeMode).make();
}