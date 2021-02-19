import { CardTypes } from "../types/card";

export type HeadlessCard = {
    width?: number;
    height?: number;
    type: CardTypes.Headless;
    html: HTMLElement;
}