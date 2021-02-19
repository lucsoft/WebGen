import { DefaultCard } from "../cards/defaultCard";
import { HeadlessCard } from "../cards/headlessCard";
import { ModernCard } from "../cards/modernCard";
import { NoteCard } from "../cards/noteCard";
import { RichCard } from "../cards/richCard";

export type CommonCard =
    ModernCard
    | DefaultCard
    | RichCard
    | NoteCard
    | HeadlessCard

export const enum CardTypes
{
    Default,
    Modern,
    Note,
    Rich,
    Headless
}

export type CommonCardData = {
    width?: number;
    height?: number;
}
