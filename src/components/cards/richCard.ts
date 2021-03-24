
import { ButtonActions } from "../../types/actions";
import { CommonCard } from "../../types/card";
import { HTMLStringy } from "../../types/html";

import '../../css/cards.rich.webgen.static.css';
import { createElement, custom, span } from "../Components";

export const richCard = (options: {
    title: HTMLStringy,
    content: (HTMLStringy)[] | (HTMLStringy),
    buttons?: (ButtonActions & { color: "red" | "normal" })[],
    width?: number,
    height?: number
}): CommonCard =>
({
    getSize: () => ({ height: options.height ? options.height + 1 : undefined, width: options.width }),
    draw: (card) => {
        if (options.title)
            card.append(custom('h1', options.title, 'rich-title'));

        card.classList.add("rich");
        const container = createElement('div');
        container.classList.add('container');
        if (typeof options.content == "string")
            container.append(span(options.content, "title"));
        else if (options.content instanceof HTMLElement)
            container.append(options.content);
        else
            options.content.forEach(x => container.append(typeof x == "string" ? span(x, "title") : x));

        card.append(container);
        if (options.buttons) {
            let buttonlist = createElement("buttonlist");
            card.classList.add('buttons');
            options.buttons.forEach(x => {
                const button = custom('button', x.title, x.color);
                button.onclick = x.action;
                buttonlist.append(button)
            });
            card.append(buttonlist);
        } else
            card.style.paddingBottom = "var(--gap)"
        return card;
    }
})
