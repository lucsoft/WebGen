import { CommonCard, Component } from "../../types";
import { createElement } from "../Components";
import '../../css/stack.webgen.static.css';

export type StackOpts = {
    gap?: string,
    classes?: string[]
    align?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-evenly' | 'space-around',
    margin?: string
};

export const Horizontal = (opts: StackOpts, ...components: Component[]): Component => {
    let list = createElement("div") as HTMLDivElement;
    list.classList.add("horizontal-stack");
    applySettings(opts, list);
    if (opts.align)
        list.style.justifyContent = opts.align;
    components.forEach((e) => {
        if (e instanceof HTMLElement)
            list.append(e);
        else list.append(e.draw())
    })

    return list;
}

export const Vertical = (opts: StackOpts, ...components: Component[]): Component => {
    let list = createElement("div") as HTMLDivElement;
    list.classList.add("vertical-stack");
    applySettings(opts, list);
    if (opts.align)
        list.style.alignItems = opts.align;
    components.forEach((e) => {
        if (e instanceof HTMLElement)
            list.append(e);
        else list.append(e.draw())
    })

    return list;
}


export const Grid = ({ minColumnWidth, maxWidth, gap }: {
    minColumnWidth?: number,
    maxWidth?: string,
    gap?: number
}, ...cardArray: CommonCard[]): Component => {
    let element = createElement("grid");
    if (minColumnWidth)
        element.style.setProperty('--card-min-width', minColumnWidth + "rem")
    if (maxWidth)
        element.style.setProperty('--max-width', maxWidth)
    if (gap)
        element.style.setProperty('--gap', minColumnWidth + "rem")

    element.append(...cardArray.map(x => {
        const card = createElement('card');
        const { height, width } = x.getSize();
        if (height && height > 0) card.style.gridRow = `span ${height}`;
        if (width && width > 0) card.style.gridColumn = `span calc(${width})`;
        return x.draw(card)
    }))
    return element;
}

function applySettings(opts: StackOpts, list: HTMLDivElement) {
    if (opts.gap)
        list.style.gap = opts.gap;
    if (opts.classes)
        list.classList.add(...opts.classes)
    if (opts.margin) {
        list.style.width = `calc(100% - ${opts.margin} - ${opts.margin})`;
        list.style.margin = opts.margin;
    }
}
