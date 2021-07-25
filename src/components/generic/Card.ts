import { CommonCard, Component } from "../../types";
import { createElement } from "../Components";

export const Card = ({ minColumnWidth, maxWidth, gap }: {
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