
import '../../css/cards.note.webgen.static.css';
import { CommonCard, Component } from "../../types.ts";
import { PlainText } from "../generic/PlainText.ts";
import { Horizontal, Spacer } from "../generic/Stacks.ts";
import { headless } from "./headlessCard.ts";

export const noteCard = (options: { title: Component, icon: string, width?: number, height?: number }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    make: () => headless(Horizontal(
        PlainText(options.icon).addClass("icon"),
        options.title.addClass("text"),
        Spacer()
    )).make().addClass("note")
})