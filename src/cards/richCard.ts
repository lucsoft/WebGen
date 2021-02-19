
import { ButtonActions } from "../types/actions";
import { CardTypes, CommonCardData } from "../types/card";
import { HTMLStringy } from "../types/html";

export type RichCard = CommonCardData & {
    type: CardTypes.Rich
    title: HTMLStringy;
    content: (HTMLStringy)[] | (HTMLStringy);
    buttons?: (ButtonActions & { color: "red" | "normal" })[];
}

export const richCard = (options: { title: HTMLStringy, content: (HTMLStringy)[] | (HTMLStringy), buttons?: (ButtonActions & { color: "red" | "normal" })[], width?: number, height?: number }): RichCard =>
({
    type: CardTypes.Rich,
    title: options.title,
    content: options.content,
    buttons: options.buttons,
    height: options.height ? options.height + 1 : undefined,
    width: options.width
})
