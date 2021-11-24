
import { ButtonStyle, CommonCard, Component } from "../../types.ts";
import '../../css/cards.rich.webgen.static.css';
import { createElement, custom } from "../Components.ts";
import { Color } from "../../lib/Color.ts";
import { Horizontal, Spacer, Vertical } from "../generic/Stacks.ts";
import { Button } from "../generic/Button.ts";
import { Custom } from "../generic/Custom.ts";
import { Card } from "../generic/Card.ts";
import { dropNullish } from "../Helper.ts";
import { PlainText } from "../generic/PlainText.ts";
import { headless } from "./headlessCard.ts";

function getStateFromData(variant: ButtonStyle | undefined, options: any, index: number): ButtonStyle {
    return variant ?? (options.buttons?.length == 1 ? ButtonStyle.Normal : (index == 1 ? ButtonStyle.Normal : ButtonStyle.Inline));
}

export const richCard = (options: {
    title: string,
    content: Component,
    buttonListLeftArea?: Component,
    buttons?: { title: string, action: () => (void | Promise<void>), variant?: ButtonStyle, color?: Color }[],
    width?: number,
    height?: number
}): CommonCard =>
({
    getSize: () => ({ height: options.height ? options.height + 1 : undefined, width: options.width }),
    make: () => headless(Vertical(
        options.title ? PlainText(options.title, "h1").addClass("rich-title") : null,
        options.content.addClass("container"),
        options.buttonListLeftArea || options.buttons ? Horizontal(
            options.buttonListLeftArea ?? null,
            Spacer(),
            ...(options.buttons ?? []).map(({ action, title, color, variant }, index) => Button(title)
                .onClick(async ({ changeState }) => {
                    changeState(ButtonStyle.Spinner);
                    await action();
                    changeState(getStateFromData(variant, options, index));
                })
                .setColor(color ?? Color.Grayscaled)
                .setStyle(getStateFromData(variant, options, index))
            )

        )
            .addClass("button-list") : null
    ))
        .make()
        .addClass("rich")
})