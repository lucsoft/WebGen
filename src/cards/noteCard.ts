
import { CardTypes, CommonCardData } from "../types/card";
import { HTMLStringy } from "../types/html";

export type NoteCard = CommonCardData & {
    type: CardTypes.Note
    icon: string
    title: HTMLStringy
}

export const noteCard = (options: { title: HTMLStringy, icon: string, width?: number, height?: number }): NoteCard =>
({
    type: CardTypes.Note,
    icon: options.icon,
    title: options.title,
    width: options.width,
    height: options.height
})