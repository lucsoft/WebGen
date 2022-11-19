import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { ButtonStyle, changeClassAtIndex, Color, PlainText } from "../../webgen.ts";
import { createElement } from "../Components.ts";
import { InputForm, speicalSyles } from "./FormInputs.ts";

export type TextInputMode = "text" | "email" | "password" | "url";
export type InputDataMode = "live" | "blur";

export class TextInputComponent<Value extends string> extends InputForm<Value> {
    input = createElement("input");
    constructor(type: TextInputMode, label: string, mode: InputDataMode) {
        super();
        this.wrapper.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        this.wrapper.classList.add("winput", Color.Grayscaled, ButtonStyle.Normal);
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
        if (mode == "live") {
            this.input.onkeyup = () => this.setValue(this.parseData(this.input.value));
        } else {
            this.input.onchange = () => {
                if (this.input.value === "") {
                    this.wrapper.classList.remove("has-value");
                    this.input.blur();
                }
                this.setValue(this.parseData(this.input.value));
            };
        }
        this.wrapper.append(placeholder, this.input);
    }
    setStyle(style: ButtonStyle) {
        this.wrapper.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
        changeClassAtIndex(this.wrapper, style, 2);
        return this;
    }
    setColor(color: Color) {
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        this.input.disabled = color == Color.Disabled;
        return this;
    }
    parseData(data: FormDataEntryValue): Value {
        return <Value>data.toString();
    }
    saveData(text: Value) {
        return text;
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
