import { CommonCard } from "../../types";
import { custom, } from "../Components";
import '../../css/cards.lline.webgen.static.css';
import { PlainText } from "../generic/PlainText";

export const defaultCard = (options: { title: string, subtitle?: string, small?: boolean, width?: number, height?: number; }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    draw: (card) => {
        if (options.small) card.classList.add("small");

        card.classList.add("lline")
        card.append(custom('h1', options.title, 'title'));
        if (options.subtitle) {
            card.classList.add("subtitle")
            card.append(PlainText(options.subtitle).addClass('subtitle').draw());
        }

        return card;
    }
})
