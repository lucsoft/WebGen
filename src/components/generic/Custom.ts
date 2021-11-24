import { Component } from "../../types.ts";

export const Custom = (text: HTMLElement): Component => {
    const settings: Component = {
        draw: () => text,
        addClass: (...classes: string[]) => {
            text.classList.add(...classes);
            return settings;
        }
    }
    return settings;
}