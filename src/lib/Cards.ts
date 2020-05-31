export interface DefaultCard
{
    width?: number;
    height?: number;
    type: "default"
    small: boolean;
    title: HTMLElement | string;
    subtitle?: HTMLElement | string;
}
export interface ModernCard
{
    width?: number;
    height?: number;
    type: "modern";
    title: HTMLElement | string;
    subtitle?: string;
    icon?: string;
    description?: HTMLElement | string;
    align: "right" | "left";
}
export type ButtonActions = {
    text: HTMLElement | string;
    action: () => void;
}
export interface NoteCard
{
    width?: number;
    height?: number;
    type: "note";
    icon: string;
    title: HTMLElement | string;
}
export interface RichCard
{
    width?: number;
    height?: number;
    type: "rich";
    title: HTMLElement | string;
    content: (HTMLElement | string)[] | (HTMLElement | string);
    buttons?: (ButtonActions & { color: "red" | "normal" })[];
}
export const defaultCard = (options: { title: HTMLElement | string, subtitle?: string, small?: boolean, width?: number, height?: number; }): DefaultCard =>
    ({
        type: "default",
        title: options.title,
        small: options.small ?? false,
        subtitle: options.subtitle,
        width: options.width,
        height: options.height
    })
export const modernCard = (options: { title: HTMLElement | string, subtitle?: string, description?: HTMLElement | string, align?: "right" | "left", icon?: string, width?: number, height?: number; }): ModernCard =>
    ({
        type: "modern",
        title: options.title,
        align: options.align ?? 'left',
        description: options.description,
        subtitle: options.subtitle,
        icon: options.icon,
        width: options.width,
        height: options.height
    })
export const noteCard = (options: { title: HTMLElement | string, icon: string, width?: number, height?: number }): NoteCard =>
    ({
        type: "note",
        icon: options.icon,
        title: options.title,
        width: options.width,
        height: options.height
    })
export const richCard = (options: { title: HTMLElement | string, content: (HTMLElement | string)[] | (HTMLElement | string), buttons?: (ButtonActions & { color: "red" | "normal" })[], width?: number, height?: number }): RichCard =>
    ({
        type: "rich",
        title: options.title,
        content: options.content,
        buttons: options.buttons,
        height: options.height,
        width: options.width
    })
export const checkIfModernCard = (card: any): card is ModernCard => card.type === "modern";

export const checkIfDefaultCard = (card: any): card is DefaultCard => card.type === "default";

export const checkIfRichCard = (card: any): card is RichCard => card.type === "rich";

export const checkIfNoteCard = (card: any): card is NoteCard => card.type === "note";
