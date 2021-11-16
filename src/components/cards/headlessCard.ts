import { CommonCard, Component } from "../../types";
import { createElement } from "../Components";
import { Custom } from "../generic/Custom";

export const headless = (element: Component): CommonCard =>
({
    getSize: () => ({ height: undefined, width: undefined }),
    make: () => {
        const card = createElement('card' as any);
        card.append(element.draw())
        return Custom(card);
    }
})
