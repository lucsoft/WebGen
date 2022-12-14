
import { ButtonStyle, CommonCard, Component } from "../../types.ts";
import '../../css/cards.rich.webgen.static.css';
import { Color } from "../../lib/Color.ts";
import { Horizontal, Spacer, Vertical } from "../generic/Stacks.ts";
import { Button } from "../generic/Button.ts";
import { PlainText } from "../generic/PlainText.ts";
import { headless } from "./headlessCard.ts";
import { _format } from "https://deno.land/std@0.167.0/path/_util.ts";

function getStateFromData(variant: ButtonStyle | undefined, options: RichCardOptions, index: number): ButtonStyle {
    return variant ?? (options.buttons?.length == 1 ? ButtonStyle.Normal : (index == 1 ? ButtonStyle.Normal : ButtonStyle.Inline));
}

type RichCardOptions = {
    title: string;
    content: Component;
    buttonListLeftArea?: Component;
    buttons?: {
        title: string;
        action: () => (void | Promise<void>);
        variant?: ButtonStyle;
        color?: Color;
    }[];
    width?: number;
    height?: number;
};

export const richCard = (options: RichCardOptions): CommonCard =>
({
    getSize: () => ({ height: options.height ? options.height + 1 : undefined, width: options.width }),
    make: () => headless(Vertical(
        options.title ? PlainText(options.title, "h1").addClass("rich-title") : null,
        options.content.addClass("container"),
        options.buttonListLeftArea || options.buttons ? Horizontal(
            options.buttonListLeftArea ?? null,
            Spacer(),
            ...(options.buttons ?? []).map(({ action, title, color, variant }, index) => Button(title)
                .onClick(async (_, { setStyle }) => {
                    setStyle(ButtonStyle.Spinner);
                    await action();
                    setStyle(getStateFromData(variant, options, index));
                })
                .setColor(color ?? Color.Grayscaled)
                .setStyle(getStateFromData(variant, options, index))
            )

        )
            .addClass("button-list") : null
    ))
        .make()
        .addClass("rich")
});