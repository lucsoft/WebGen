
import { CommonCard } from "../../types/card";
import { HTMLStringy } from "../../types/html";
import '../../css/cards.note.webgen.static.css';
import { span } from "../Components";

export const noteCard = (options: { title: HTMLStringy, icon: string, width?: number, height?: number }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    draw: (card) => {
        card.classList.add('note');
        card.append(
            span(options.icon, 'icon'),
            span(options.title, 'text')
        );
        return card;
    }
})