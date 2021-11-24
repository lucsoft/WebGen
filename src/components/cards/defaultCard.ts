import { CommonCard } from "../../types.ts";
import '../../css/cards.lline.webgen.static.css';
import { PlainText } from "../generic/PlainText.ts";
import { headless } from "./headlessCard.ts";
import { Spacer, Vertical } from "../generic/Stacks.ts";

export const defaultCard = (options: { title: string, subtitle?: string, small?: boolean, width?: number, height?: number; }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    make: () => headless(Vertical(
        Spacer(),
        PlainText(options.title, "h1").addClass("title"),
        Spacer(),
        options.subtitle ? PlainText(options.subtitle).addClass('subtitle') : null
    )).make()
        .addClass("lline", options.small ? "small" : "big", options.subtitle ? "subtitle" : "no-subtitle")
})
