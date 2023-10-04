import { Component } from "../Component.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import "./IconButton.css";
export class IconButtonComponent extends ColoredComponent {
    constructor(icon: Component, label: string) {
        super();
        this.wrapper.classList.add("wiconbutton");
        this.wrapper.append(
            icon.draw(),
        );
        this.wrapper.ariaLabel = label;
    }
    asLinkButton(url: string, target?: string) {
        this.wrapper.href = url;
        if (target)
            this.wrapper.target = target;
        return this;
    }
    setStyle(_style: ButtonStyle): this {
        throw new Error("Method not implemented.");
    }
}

export const IconButton = (icon: Component, label: string) => new IconButtonComponent(icon, label);