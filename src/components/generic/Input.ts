import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement, span } from "../Components";
import '../../css/input.webgen.static.css';

export const Input = ({ color, value, changeOn, blurOn, placeholder, type, autoFocus }: {
    type?: "text" | "email" | "password" | "url"
    color?: Color,
    placeholder: string,
    value?: string,
    autoFocus?: boolean,
    blurOn?: (value: string) => void,
    changeOn?: (value: string) => void,
}): Component => {
    let shell = createElement("div") as HTMLDivElement;
    shell.classList.add("winput", color ?? Color.Grayscaled)
    let label = span(placeholder)

    let input = createElement("input") as HTMLInputElement;
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
    input.onblur = () => {
        if (input.value === "") {
            shell.classList.remove("has-value")
            input.blur();
        }
        blurOn?.(input.value)
    }
    //@ts-ignore
    if (autoFocus) input.autofocus = "true";
    input.onchange = () => changeOn?.(input.value);

    shell.append(label, input)
    return shell;
}