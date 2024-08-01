import { accessibilityDisableTabOnDisabled } from "./Accessibility.ts";
import { Color } from "./Color.ts";
import { Component } from "./Component.ts";
import { createElement } from "./Components.ts";
import { asRef, Refable } from "./State.ts";

export type ComponentArray = ((Component | null)[] | Component | null)[];

export type ButtonActions = {
    title: string;
    action: () => void;
};

export const enum CardTypes {
    Default,
    Modern,
    Note,
    Rich,
    Headless
}

export const enum ButtonStyle {
    Inline = "inline",
    Normal = "normal",
    Secondary = "secondary",
    Spinner = "spinner",
    Progress = "progress"
}

export abstract class ColoredComponent extends Component {
    color = asRef(Color.Grayscaled);
    constructor(wrapper: HTMLElement = createElement("a")) {
        super(wrapper);
        this.color.listen((val) => {
            this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(val);
        });

        this.addClass(this.color);
    }
    abstract setStyle(style: Refable<ButtonStyle>): this;
    setColor(color: Refable<Color>) {
        asRef(color).listen((val) => this.color.setValue(val));
        return this;
    }
}

export type ColorDef = { [ color in Color ]: [ hue: number, saturation: number, lightness: number, font: string ] };
