import { CommonCard } from "../../types/card"
import { HTMLStringy } from "../../types/html"
import { custom, span } from "../Components";

import '../../css/cards.lline.webgen.static.css';

export const defaultCard = (options: { title: HTMLStringy, subtitle?: string, small?: boolean, width?: number, height?: number; }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    draw: (card) => {
        if (options.small) card.classList.add("small");

        card.classList.add("lline")
        card.append(custom('h1', options.title, 'title'));
        if (options.subtitle) {
            card.classList.add("subtitle")
            card.append(span(options.subtitle, 'subtitle'));
        }

        return card;
    }
})
