
import '../../css/cards.note.webgen.static.css';
import { CommonCard, Component } from "../../types";
import { PlainText } from "../generic/PlainText";

export const noteCard = (options: { title: Component, icon: string, width?: number, height?: number }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    draw: (card) => {
        card.classList.add('note');
        card.append(
            PlainText(options.icon).addClass("icon").draw(),
            options.title.addClass("text").draw()
        );
        return card;
    }
})