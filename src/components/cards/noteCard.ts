
import '../../css/cards.note.webgen.static.css';
import { CommonCard, Component } from "../../types";
import { PlainText } from "../generic/PlainText";
import { Horizontal, Spacer } from "../generic/Stacks";
import { headless } from "./headlessCard";

export const noteCard = (options: { title: Component, icon: string, width?: number, height?: number }): CommonCard =>
({
    getSize: () => ({ height: options.height, width: options.width }),
    make: () => headless(Horizontal(
        PlainText(options.icon).addClass("icon"),
        options.title.addClass("text"),
        Spacer()
    )).make().addClass("note")
})