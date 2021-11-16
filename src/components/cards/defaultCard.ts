import { CommonCard } from "../../types";
import { custom, } from "../Components";
import '../../css/cards.lline.webgen.static.css';
import { PlainText } from "../generic/PlainText";
import { headless } from "./headlessCard";
import { Vertical } from "../generic/Stacks";
import { dropNullish } from "../Helper";

export const defaultCard = (options: { title: string, subtitle?: string, small?: boolean, width?: number, height?: number; }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    make: () => headless(Vertical(
        PlainText(options.title, "h1").addClass("title"),
        options.subtitle ? PlainText(options.subtitle).addClass('subtitle') : null
    )).make()
        .addClass("lline", options.small ? "small" : "big", options.subtitle ? "subtitle" : "no-subtitle")
})
