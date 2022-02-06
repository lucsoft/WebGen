import { CommonCard, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { Custom } from "../generic/Custom.ts";

export const headless = (element: Component): CommonCard =>
({
    getSize: () => ({ height: undefined, width: undefined }),
    make: () => {
        const card = createElement('card' as 'div');
        card.append(element.draw())
        return Custom(card);
    }
})
