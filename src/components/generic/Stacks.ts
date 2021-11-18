import { BaseComponent, CommonCard, Component } from "../../types";
import { createElement } from "../Components";
import '../../css/stack.webgen.static.css';
import { dropNullish } from "../Helper";

export function Spacer() {
    const spacer = createElement("div");
    spacer.classList.add("spacer");
    const settings: Component = {
        draw: () => spacer,
        addClass: (...classes: string[]) => {
            spacer.classList.add(...classes);
            return settings;
        }
    };
    return settings;
}

export interface StackComponent extends BaseComponent<StackComponent, HTMLDivElement> {
    setMargin: (margin?: string) => StackComponent
    setGap: (gap: string) => StackComponent
}
function makeSettings(list: HTMLDivElement) {
    const settings: StackComponent = {
        draw: () => list,
        addClass: (...classes: string[]) => {
            list.classList.add(...classes);
            return settings;
        },
        setMargin: (margin?: string) => {
            list.style.width = margin ? `calc(100% - ${margin} - ${margin})` : "";
            list.style.margin = margin ?? "";
            return settings;
        },
        setGap: (gap: string) => {
            list.style.gap = gap;
            return settings;
        }
    }
    return settings;
}

export const Horizontal = (...components: (Component | null)[]) => {
    const list = createElement("div");
    list.classList.add("horizontal-stack");
    dropNullish(...components).forEach((e) => list.append(e.draw()))
    return makeSettings(list);
}

export const Vertical = (...components: (Component | null)[]) => {
    let list = createElement("div");
    list.classList.add("vertical-stack");
    dropNullish(...components).forEach((e) => list.append(e.draw()))
    return makeSettings(list);
}

export interface GridComponent extends BaseComponent<GridComponent, HTMLDivElement> {
    setMaxWidth: (maxWidth: string) => GridComponent
    setMinColumnWidth: (width: string) => GridComponent
    setGap: (gap: string) => GridComponent
}
export const Grid = (...cardArray: CommonCard[]) => {
    let element = createElement("grid" as "div");
    element.append(...cardArray.map(x => {
        const card = x.make().draw();
        const { height, width } = x.getSize();
        if (height && height > 0) card.style.gridRow = `span ${height}`;
        if (width && width > 0) card.style.gridColumn = `span calc(${width})`;
        return card
    }))
    const settings: GridComponent = {
        draw: () => element,
        addClass: (...classes: string[]) => {
            element.classList.add(...classes);
            return settings;
        },
        setMaxWidth: (maxWidth: string) => {
            element.style.setProperty('--max-width', maxWidth)
            return settings;
        },
        setMinColumnWidth: (width: string) => {
            element.style.setProperty('--card-min-width', width)
            return settings;
        },
        setGap: (gap: string) => {
            element.style.setProperty('--gap', gap)
            return settings;
        }
    };
    return settings;
}