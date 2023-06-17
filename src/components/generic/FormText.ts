import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { ButtonStyle, changeClassAtIndex, Color, isPointer, PlainText, Pointable } from "../../webgen.ts";
import { createElement } from "../Components.ts";
import { InputForm, speicalSyles } from "./FormInputs.ts";

export type TextInputMode = "text" | "email" | "password" | "url" | "date";
export type InputDataMode = "live" | "blur";

export class TextInputComponent<Value extends string | undefined> extends InputForm<Value> {
    input = createElement("input");
    constructor(type: TextInputMode, label: string, mode: InputDataMode) {
        super();
        this.wrapper.classList.add("winput", Color.Grayscaled, ButtonStyle.Normal);
        this.input.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        const placeholder = PlainText(label).draw();

        this.input.type = type;
        this.addEventListener("update", (event) => {
            const value = (<CustomEvent<Value>>event).detail;
            if (value)
                this.wrapper.classList.add("has-value");
            this.input.value = value ?? "";
        });
        this.input.onfocus = () => {
            this.input.focus();
            this.wrapper.classList.add("has-value");
        };
        this.wrapper.onclick = () => {
            if (this.input.value === "") {
                this.wrapper.classList.add("has-value");
                this.input.focus();
            }
        };
        this.input.onblur = () => {
            if (this.input.value === "") {
                this.wrapper.classList.remove("has-value");
            }
        };
        if (mode == "live" || type == "date") {
            this.input.oninput = () => this.setValue(this.input.value as Value);
        } else {
            this.input.onchange = () => {
                this.setValue(this.input.value as Value);
            };
        }
        this.wrapper.append(placeholder, this.input);
    }
    setStyle(style: ButtonStyle) {
        this.wrapper.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
        changeClassAtIndex(this.wrapper, style, 2);
        return this;
    }
    required() {
        this.input.required = true;
        return this;
    }
    setAutofill(text: string) {
        this.input.autocomplete = text;
        return this;
    }
    setColor(color: Pointable<Color>) {
        if (isPointer(color)) {
            color.on((val) => this.setColor(val));
            return this;
        }
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        this.input.disabled = color == Color.Disabled;
        return this;
    }
}

export class InlineTextComponent<Value extends string> extends TextInputComponent<Value> {
    constructor(type: TextInputMode, mode: InputDataMode) {
        super(type, "", mode);
        this.wrapper.classList.add("inline", "has-value", "justify-content-space");
        this.wrapper.children[ 0 ].remove();
    }
}

/**
 * The Simple TextInput.
 *
 * @param type defines the HTMLInputType
 * @param label Shows as fullsize when inputs is empty and gets smaller when value gets filled/is filled
 * @param mode Changes how updates work. live emits an update event on keypress. blur when the input loses focus
 */
export const TextInput = (type: TextInputMode, label: string, mode: InputDataMode = "live") => new TextInputComponent(type, label, mode);


/**
 * The Simple InlineTextInput.
 *
 * @param type defines the HTMLInputType
 * @param mode Changes how updates work. live emits an update event on keypress. blur when the input loses focus
 */
export const InlineTextInput = (type: TextInputMode, mode: InputDataMode = "live") => new InlineTextComponent(type, mode);
