import { CardTypes, CommonCardData } from "../types/card";
import { HTMLStringy } from "../types/html";

export type DefaultCard = CommonCardData & {
    type: CardTypes.Default
    small: boolean
    title: HTMLStringy
    subtitle?: HTMLStringy
}

export const defaultCard = (options: { title: HTMLStringy, subtitle?: string, small?: boolean, width?: number, height?: number; }): DefaultCard =>
({
    type: CardTypes.Default,
    title: options.title,
    small: options.small ?? false,
    subtitle: options.subtitle,
    width: options.width,
    height: options.height
})
