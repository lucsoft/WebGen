import { accessibilityDisableTabOnDisabled } from "./Accessibility.ts";
import { Color } from "./Color.ts";
import { Component } from "./Component.ts";
import { createElement } from "./Components.ts";
import { asPointer, isPointer, Pointable } from "./State.ts";

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

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
export type FontWeight = | 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
export abstract class ColoredComponent extends Component {
    color = asPointer(Color.Grayscaled);
    constructor(wrapper: HTMLElement = createElement("a")) {
        super(wrapper);
        this.color.listen((val) => {
            this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(val);
        });

        this.addClass(this.color);
    }
    abstract setStyle(style: Pointable<ButtonStyle>): this;
    setColor(color: Pointable<Color>) {
        if (isPointer(color)) {
            color.listen((val) => this.setColor(val));
            return this;
        }
        this.color.setValue(color);
        return this;
    }
}

export type ColorDef = { [ color in Color ]: [ hue: number, saturation: number, lightness: number, font: string ] };
