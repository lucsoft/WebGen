import { Color } from "../../core/color.ts";
import { asWebGenComponent, Component, HTMLComponent } from "../../core/components.ts";
import { css } from "../../core/cssTemplate.ts";
import { Label } from "../../core/mod.ts";
import { alwaysRef, asRef, Refable, Reference } from "../../core/state.ts";

export enum ButtonMode {
    Primary = "primary",
    Secondary = "secondary",
    Text = "text"
}

@asWebGenComponent("button")
export class ButtonComponent extends HTMLComponent {
    #disabled = asRef(false);
    #buttonInternalBg = new Color("var(--wg-internal-button-bg)");
    #buttonInternalFg = new Color("var(--wg-internal-button-fg)");
    #buttonBg = new Color("var(--wg-button-background-color, var(--wg-primary))");
    #buttonFg = new Color("var(--wg-button-text-color, var(--wg-primary-text))");
    #button = document.createElement("button");

    constructor(label: Refable<string>, mode: Reference<ButtonMode> = asRef(ButtonMode.Primary)) {
        super();

        this.shadowRoot?.append(this.#button);

        this.useListener(mode, (newMode, oldMode) => {
            if (oldMode) {
                this.#button.classList.remove(oldMode);
            }
            this.#button.setAttribute("mode", newMode);
        });

        this.#button.append(Label(alwaysRef(label)).addClass("content").draw());

        this.useListener(this.#disabled, (disabled) => {
            this.#button.disabled = disabled;
        });

        this.shadowRoot?.adoptedStyleSheets.push(css`
            button {
                all: unset;
                display: grid;
                place-items: center;
                grid-auto-flow: column;
                gap: var(--wg-gap);
                --wg-internal-button-bg: ${this.#buttonBg.toString()};
                --wg-internal-button-fg: ${this.#buttonFg.toString()};
                background-color: var(--wg-internal-button-bg);
                color: ${this.#buttonInternalFg.toString()};
                padding: var(--wg-button-padding, 0 14px);
                height: var(--wg-button-height, 36px);
                border-radius: var(--wg-button-box-shadow, var(--wg-radius-tiny));
                outline: 0px solid ${this.#buttonInternalBg.mix(Color.transparent, 50)};
                transition: all 250ms ease;
                user-select: none;
            }
            button>.content {
                padding: var(--wg-button-text-padding, 0 3px);
            }
            button:not(:disabled) {
                cursor: pointer;
            }
            button:disabled {
                --wg-internal-button-bg: var(--wg-button-disabled-color, hsl(0deg 0% 20%));
                --wg-internal-button-fg: var(--wg-button-disabled-text-color, hsl(0deg 0% 40%));
            }
            button:not(:disabled):hover,
            button:not(:disabled):focus-visible {
                outline: 5px solid ${this.#buttonInternalBg.mix(Color.transparent, 50)};
            }
            button:not(:disabled):active {
                outline: 3px solid ${this.#buttonInternalBg.mix(Color.transparent, 50)};
                transform: translate(0, 2px);
            }

            button[mode="secondary"] {
                --wg-internal-button-bg: ${this.#buttonBg.mix(Color.transparent, 90)};
                --wg-internal-button-fg: ${this.#buttonBg.toString()};
            }
            button[mode="secondary"]:hover,
            button[mode="secondary"]:focus-visible {
                --wg-internal-button-bg: ${this.#buttonBg.mix(Color.transparent, 80)};
                outline: 0px solid ${this.#buttonInternalBg.mix(Color.transparent, 50)};
            }

            button[mode="text"] {
                --wg-internal-button-bg: transparent;
                --wg-internal-button-fg: ${this.#buttonBg.toString()};
            }

            button[mode="text"]:hover,
            button[mode="text"]:focus-visible {
                --wg-internal-button-bg: ${this.#buttonBg.mix(Color.transparent, 80)};
                outline: 0px solid ${this.#buttonInternalBg.mix(Color.transparent, 50)};
            }
        `);
    }

    make() {
        const obj = {
            ...super.make(),
            addPrefix: (component: Component) => { this.#button.prepend(component.draw()); return obj; },
            addSuffix: (component: Component) => { this.#button.append(component.draw()); return obj; },
            setDisabled: (disabled: Refable<boolean>) => {
                this.useListener(alwaysRef(disabled), (newDisabled) => {
                    this.#disabled.value = newDisabled;
                });
                return obj;
            }
        };
        return obj;
    }
}

export function PrimaryButton(label: Refable<string>) {
    return new ButtonComponent(label, asRef(ButtonMode.Primary)).make();
}

export function SecondaryButton(label: Refable<string>) {
    return new ButtonComponent(label, asRef(ButtonMode.Secondary)).make();
}

export function TextButton(label: Refable<string>) {
    return new ButtonComponent(label, asRef(ButtonMode.Text)).make();
}