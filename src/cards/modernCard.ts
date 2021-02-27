import { CardTypes, CommonCardData } from "../types/card"
import { HTMLStringy } from "../types/html"

export type ModernCard = CommonCardData & {
    type: CardTypes.Modern
    title: HTMLStringy;
    subtitle?: string;
    icon?: string | { svg: string };
    description?: HTMLStringy;
    align: "right" | "left" | "down";
}

export const modernCard = (options: { title: HTMLStringy, subtitle?: string, description?: HTMLStringy, align?: "right" | "left" | "down", icon?: string | { svg: string }, width?: number, height?: number; }): ModernCard =>
({
    type: CardTypes.Modern,
    title: options.title,
    align: options.align ?? 'right',
    description: options.description,
    subtitle: options.subtitle,
    icon: options.icon,
    width: options.width,
    height: options.height ? options.height + 1 : undefined
})
