import { CommonCard, Component } from "../../types";
import { Custom } from "../generic/Custom";

export const headless = (element: Component): CommonCard =>
({
    getSize: () => ({ height: undefined, width: undefined }),
    draw: (card) => {
        const data = card.draw();
        data.append(element.draw())
        return Custom(data);
    }
})
