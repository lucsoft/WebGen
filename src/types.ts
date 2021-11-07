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
    draw: (preCard: HTMLElement) => HTMLElement
    getSize: () => { width?: number, height?: number }
}

export const enum ButtonStyle {
    Inline = "inline",
    Normal = "normal",
    Secondary = "secondary",
    Spinner = "spinner",
    Progress = "progress"
}

export type Component = {
    draw: () => HTMLElement,
    addClass: (...classes: string[]) => Component
}
export type ViewOptions<State> = {
    use: (comp: Component) => void;
    state: Partial<State>;
    update: (data: Partial<State>) => void;
};

export type ColorDef = { [ color in Color ]: [ hue: number, saturation: number, lightness: number, font: string ] };
export type ViewOptionsFunc<State> = (opt: ViewOptions<State>) => void | Component;