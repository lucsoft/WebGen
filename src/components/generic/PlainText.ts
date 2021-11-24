import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";

export const PlainText = (title: string, type: `h${1 | 2 | 3 | 4 | 5 | 6}` | `span` = "span") => {
    const text = createElement(type);
    text.innerText = title;
    const settings: Component = {
        draw: () => text,
        addClass: (...classes: string[]) => {
            text.classList.add(...classes);
            return settings;
        }
    };
    return settings;
}