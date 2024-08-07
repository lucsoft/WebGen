import { Color } from "../Color.ts";
import { createElement } from "../Components.ts";
import { asRef, Refable } from "../State.ts";
import { ButtonStyle } from "../types.ts";
import { InputForm } from "./FormInputs.ts";
import { Label } from "./Label.ts";

export type TextInputMode = "text" | "email" | "password" | "url" | "date";
export type InputDataMode = "live" | "blur";

export class TextInputComponent<Value extends string | undefined> extends InputForm<Value> {
    input = createElement("input");
    constructor(type: TextInputMode, label: string, mode: InputDataMode) {
        super();
        this.wrapper.classList.add("winput", ButtonStyle.Normal);
        const placeholder = Label(label).draw();

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

        this.color.map(it => it == Color.Disabled)
            .listen(val => this.input.disabled = val);
        this.wrapper.tabIndex = -1;
    }
    setStyle(_style: ButtonStyle) {
        return this;
    }
    required() {
        this.input.required = true;
        return this;
    }
    setAutofill(text: AutoFill) {
        this.input.autocomplete = text;
        return this;
    }
    setPlaceholder(text: Refable<string>) {
        asRef(text).listen(val => this.input.placeholder = val);
        return this;
    }
    onKeyPressed(action: (event: KeyboardEvent) => void) {
        this.input.addEventListener("keydown", (event) => action(event));
        return this;
    }
    focus() {
        this.input.focus();
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
