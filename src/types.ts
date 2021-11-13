import { Color } from "./lib/Color";

export type ButtonActions = {
    title: string;
    action: () => void;
}

export const enum CardTypes {
    Default,
    Modern,
    Note,
    Rich,
    Headless
}

export type CommonCard = {
    draw: (preCard: Component) => Component
    getSize: () => { width?: number, height?: number }
}

export const enum ButtonStyle {
    Inline = "inline",
    Normal = "normal",
    Secondary = "secondary",
    Spinner = "spinner",
    Progress = "progress"
}
export interface BaseComponent<TypeT, Component extends Element> {
    draw: () => Component,
    addClass: (...classes: string[]) => TypeT
}
export interface Component extends BaseComponent<Component, HTMLElement> { }

export type ViewOptions<State> = {
    use: (comp: Component) => void;
    state: Partial<State>;
    update: (data: Partial<State>) => void;
};

export type ColorDef = { [ color in Color ]: [ hue: number, saturation: number, lightness: number, font: string ] };
export type ViewOptionsFunc<State> = (opt: ViewOptions<State>) => void | Component;