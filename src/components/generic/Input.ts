import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement, span } from "../Components";
import '../../css/input.webgen.static.css';

export const Input = ({ color, value, changeOn, placeholder, type }: {
    type?: "text" | "email" | "password" | "url"
    color?: Color,
    placeholder: string,
    value?: string,
    changeOn?: (value: string) => void,
}): Component => {
    let shell = createElement("div") as HTMLDivElement;
    shell.classList.add("winput", color ?? Color.Grayscaled)
    if (value || "" != "") shell.classList.add("has-value")
    let label = span(placeholder)

    let input = createElement("input") as HTMLInputElement;
    input.type = type ?? "text";
    shell.tabIndex = 1;

    shell.onfocus = () => {
        input.focus()
        shell.classList.add("has-value")
    };
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
    }

    input.onchange = () => changeOn?.(input.value);

    shell.append(label, input)
    return shell;
}