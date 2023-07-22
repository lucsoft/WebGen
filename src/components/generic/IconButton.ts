import "../../css/iconbutton.webgen.static.css";
import { ButtonStyle, ColoredComponent } from "../../types.ts";
import { Component } from "../../webgen.ts";
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