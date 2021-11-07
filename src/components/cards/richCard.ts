
import { ButtonStyle, CommonCard, Component } from "../../types";
import '../../css/cards.rich.webgen.static.css';
import { createElement, custom } from "../Components";
import { Color } from "../../lib/Color";
import { Horizontal, Spacer } from "../generic/Stacks";
import { Button } from "../generic/Button";
import { Custom } from "../generic/Custom";

export const richCard = (options: {
    title: string,
    content: Component,
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
        container.append(options.content.draw())
        card.append(container);
        if (options.buttons) {
            const buttonList = Horizontal(
                Spacer(),
                ...options.buttons.map(({ action, title, color, variant }, index) => Button(title)
                    .onClick(async ({ changeState }) => {
                        changeState(ButtonStyle.Spinner);
                        await action();
                        changeState(getStateFromData(variant, options, index));
                    })
                    .setColor(color ?? Color.Grayscaled)
                    .setStyle(getStateFromData(variant, options, index))
                ))
                .setGap("0.5rem")
                .setMargin(!options.buttonListLeftArea ? ".7rem" : undefined);
            if (options.buttonListLeftArea) {
                card.append(Horizontal(Custom(options.buttonListLeftArea), buttonList)
                    .setMargin(".7rem")
                    .draw()
                );
            } else
                card.append(buttonList.draw())
        } else
            card.style.paddingBottom = "var(--gap)"
        return card;
    }
})
function getStateFromData(variant: ButtonStyle | undefined, options: { title: string; content: Component; buttonListLeftArea?: HTMLElement | undefined; buttons?: { title: string; action: (() => void) | (() => Promise<void>); variant?: ButtonStyle | undefined; color?: Color | undefined; }[] | undefined; width?: number | undefined; height?: number | undefined; }, index: number): ButtonStyle {
    return variant ?? (options.buttons?.length == 1 ? ButtonStyle.Normal : (index == 1 ? ButtonStyle.Normal : ButtonStyle.Inline));
}
