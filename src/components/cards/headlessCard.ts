import { CommonCard } from "../../types";

export const headless = (element: HTMLElement): CommonCard =>
({
    getSize: () => ({ height: undefined, width: undefined }),
    draw: (card) => {
        card.append(element)
        return card;
    }
})
