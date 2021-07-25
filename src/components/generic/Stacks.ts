import { Component } from "../../types";
import { createElement } from "../Components";
import '../../css/stack.webgen.static.css';

export type StackOpts = {
    gap?: string,
    align?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-evenly' | 'space-around'
};

export const Horizontal = (opts: StackOpts, ...components: Component[]): Component => {
    let list = createElement("div") as HTMLDivElement;
    list.classList.add("horizontal-stack");
    applySettings(opts, list);

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

    components.forEach((e) => {
        if (e instanceof HTMLElement)
            list.append(e);
        else list.append(e.draw())
    })

    return list;
}

function applySettings(opts: StackOpts, list: HTMLDivElement) {
    if (opts.gap)
        list.style.gap = opts.gap;
    if (opts.align)
        list.style.justifyContent = opts.align;
}
