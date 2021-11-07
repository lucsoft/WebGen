import { CommonCard, Component } from "../../types";
import { createElement } from "../Components";
import '../../css/stack.webgen.static.css';

export function Spacer(): Component {
    const spacer = createElement("div");
    spacer.classList.add("spacer");
    const settings = {
        draw: () => spacer,
        addClass: (...classes: string[]) => {
            spacer.classList.add(...classes);
            return settings;
        }
    };
    return settings;
}

function makeSettings(list: HTMLDivElement) {
    const settings = {
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

export const Horizontal = (...components: (Component)[]) => {
    const list = createElement("div");
    list.classList.add("horizontal-stack");
    components.forEach((e) => list.append(e.draw()))
    return makeSettings(list);
}

export const Vertical = (...components: Component[]) => {
    let list = createElement("div");
    list.classList.add("vertical-stack");
    components.forEach((e) => list.append(e.draw()))
    return makeSettings(list);
}

export const Grid = (...cardArray: CommonCard[]) => {
    let element = createElement("grid" as "title");
    element.append(...cardArray.map(x => {
        const card = createElement('card' as "div");
        const { height, width } = x.getSize();
        if (height && height > 0) card.style.gridRow = `span ${height}`;
        if (width && width > 0) card.style.gridColumn = `span calc(${width})`;
        return x.draw(card)
    }))
    const settings = {
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