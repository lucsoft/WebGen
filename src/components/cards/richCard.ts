
import { ButtonStyle } from "../../types/actions";
import { CommonCard } from "../../types/card";
import { HTMLStringy } from "../../types/html";
import '../../css/cards.rich.webgen.static.css';
import { createElement, custom, draw, span } from "../Components";
import { Color } from "../../lib/Color";
import { Horizontal } from "../generic/Stacks";
import { Button } from "../generic/Button";

export const richCard = (options: {
    title: HTMLStringy,
    content: (HTMLStringy)[] | (HTMLStringy),
    buttonListLeftArea?: HTMLElement,
    buttons?: { title: string, action: (() => void) | (() => Promise<void>), variant?: ButtonStyle, color?: Color }[],
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
            const buttonList = Horizontal({ align: 'flex-end', gap: "0.5rem", margin: !options.buttonListLeftArea ? ".7rem" : undefined },
                ...options.buttons.map(({ action, title, color, variant }, index) => Button({
                    text: title,
                    pressOn: async ({ changeState }) => {
                        changeState(ButtonStyle.Spinner);
                        await action();
                        changeState(getStateFromData(variant, options, index));
                    },
                    state: getStateFromData(variant, options, index),
                    color: color ?? Color.Grayscaled
                })));
            if (options.buttonListLeftArea) {
                card.append(draw(Horizontal({ align: 'space-between', margin: ".7rem" }, options.buttonListLeftArea, buttonList)));
            } else
                card.append(draw(buttonList))
        } else
            card.style.paddingBottom = "var(--gap)"
        return card;
    }
})
function getStateFromData(variant: ButtonStyle | undefined, options: { title: HTMLStringy; content: (HTMLStringy)[] | (HTMLStringy); buttonListLeftArea?: HTMLElement | undefined; buttons?: { title: string; action: (() => void) | (() => Promise<void>); variant?: ButtonStyle | undefined; color?: Color | undefined; }[] | undefined; width?: number | undefined; height?: number | undefined; }, index: number): ButtonStyle {
    return variant ?? (options.buttons?.length == 1 ? ButtonStyle.Normal : (index == 1 ? ButtonStyle.Normal : ButtonStyle.Inline));
}
