export type ButtonActions = {
    title: string;
    action: () => void;
}

export const enum ButtonStyle {
    Inline = "inline",
    Normal = "normal",
    Secondary = "secondary",
    Spinner = "spinner",
    Progress = "progress"
}