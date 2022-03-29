import { Color } from "../../lib/Color.ts";
import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import '../../css/input.webgen.static.css';
import { PlainText } from "./PlainText.ts";
import { Custom } from "./Custom.ts";

/**
 * @deprecated Options will be removed intro a build like style as the other components
 */
export const Input = ({ color, value, changeOn, liveOn, blurOn, placeholder, type, autoFocus }: {
    type?: "text" | "email" | "password" | "url"
    color?: Color,
    placeholder: string,
    value?: string,
    autoFocus?: boolean,
    liveOn?: (value: string) => void,
    blurOn?: (value: string) => void,
    changeOn?: (value: string) => void,
}): Component => {
    const shell = createElement("div") as HTMLDivElement;
    shell.classList.add("winput", color ?? Color.Grayscaled)
    const label = PlainText(placeholder).draw()

    const input = createElement("input") as HTMLInputElement;
    if (value || "" != "") { shell.classList.add("has-value"); input.value = value ?? ""; }
    input.type = type ?? "text";
    input.disabled = color == Color.Disabled;
    input.onfocus = () => {
        input.focus()
        shell.classList.add("has-value")
    }
    shell.onclick = () => {
        if (input.value === "") {
            shell.classList.add("has-value")
            input.focus();
        }
    }
    input.onkeyup = () => liveOn?.(input.value);
    input.onblur = () => {
        if (input.value === "") {
            shell.classList.remove("has-value")
            input.blur();
        }
        blurOn?.(input.value)
    }
    //@ts-ignore this still exsists i don't know why lib.ts just doesn't include it
    if (autoFocus) input.autofocus = "true";
    input.onchange = () => changeOn?.(input.value);

    shell.append(label, input)
    return Custom(shell);
}