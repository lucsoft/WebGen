import { CommonCard, Component } from "../../types"
import '../../css/cards.modern.webgen.static.css';
import { createElement, custom, img } from "../Components";

export const modernCard = (options: { title: string, subtitle?: string, description?: Component, align?: "right" | "left" | "down", icon?: string | { svg: string }, width?: number, height?: number; }): CommonCard =>
({
    getSize: () => ({ height: options.height ? options.height + 1 : undefined, width: options.width }),
    draw: (card) => {
        let icon: any = img(undefined);

        if (options.icon) {
            card.classList.add('img');
            if (typeof options.icon == "string") {
                icon.loading = "lazy";
                icon.alt = options.title;
                icon.width = 60;
                icon.height = 60;
                icon.src = options.icon;
            } else
                icon = new DOMParser().parseFromString(options.icon.svg, "image/svg+xml").children[ 0 ];
        }
        if (options.icon && (options.align ?? 'right') != "right")
            card.append(icon)
        card.classList.add('modern');
        card.classList.add(options.align ?? 'right');
        const container = createElement('div');
        container.classList.add('title-list')
        if (options.subtitle !== undefined) {
            card.classList.add("subtitle")
            const subtitle = createElement('h1');
            subtitle.classList.add('subtitle');
            subtitle.innerText = options.subtitle;
            container.append(subtitle);
        }

        container.append(custom('h1', options.title, 'title'));
        card.append(container);

        if (options.icon && (options.align ?? 'right') == "right")
            card.append(icon)

        if (options.description) {
            card.classList.add("description")
            card.append(options.description.addClass('description').draw());
        }
        return card;
    }
})
