import { createElement } from "./components/Components.ts";
import { Color } from "./lib/Color.ts";
import { CustomComponent } from "./webgen.ts";

export type WebGenGlobalThis = (typeof globalThis & {
    WEBGEN_ICON: string;
});

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
    make: () => CustomComponent
    getSize: () => { width?: number, height?: number }
}

export const enum ButtonStyle {
    Inline = "inline",
    Normal = "normal",
    Secondary = "secondary",
    Spinner = "spinner",
    Progress = "progress"
}

export abstract class Component {
    protected wrapper: HTMLElement = createElement("div")

    addClass(...classes: string[]) {
        this.wrapper.classList.add(...classes);
        return this;
    }
    setPadding(size: string) {
        this.wrapper.style.padding = size;
        return this;
    }
    setMargin(size: string) {
        this.wrapper.style.margin = size;
        return this;
    }
    setId(id: string) {
        this.wrapper.id = id;
        return this;
    }
    setGrow(value = 1) {
        this.wrapper.style.flexGrow = value.toString();
        return this;
    }
    setAlign(type: "center" | "flex-end" | "flex-start" | "stretch") {
        this.wrapper.style.alignItems = type;
        return this;
    }
    setJustify(type: "center" | "flex-end" | "flex-start" | "stretch") {
        this.wrapper.style.justifyItems = type;
        return this;
    }
    setDirection(type: "column" | "row" | "row-reverse" | "column-reverse"): CustomComponent {
        this.wrapper.style.flexDirection = type;
        return this;
    }
    draw() {
        return this.wrapper;
    }
    onClick(func: (ev: MouseEvent) => void) {
        this.wrapper.addEventListener('click', func)
        return this;
    }
}
export abstract class ColoredComponent extends Component {
    wrapper = createElement("a")
    constructor() {
        super()
    }
    abstract setStyle(style: ButtonStyle): typeof this
    abstract setColor(color: Color): typeof this
}

export type ViewOptions<State> = {
    use: (comp: Component) => void;
    state: Partial<State>;
    update: (data: Partial<State>) => void;
};

export type ColorDef = { [ color in Color ]: [ hue: number, saturation: number, lightness: number, font: string ] };
export type ViewOptionsFunc<State> = (opt: ViewOptions<State>) => void | Component;