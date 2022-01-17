import { Component } from "../../types.ts";
import { custom } from "../Components.ts";
import { Custom } from "./Custom.ts";
import { PlainText } from "./PlainText.ts";

export const Icon = (icon: string, ...classList: string[]): Component => {
    const webgenIcon: string = (globalThis as any).WEBGEN_ICON;
    switch (webgenIcon) {
        case "material":
            return Custom(custom("span", icon, "material-icons-round", "webgen-icon", ...classList))
        case "bootstrap":
            return Custom(custom("span", undefined, "bi", `bi-${icon}`, "webgen-icon", ...classList))
        default:
            return PlainText("")
    }
};

export const enum CommonIconType {
    ArrowDown,
    Done,
    Close,
    Download,
    Edit,
    Delete
}

export const CommonIcon = (icon: CommonIconType): string => {
    const webgenIcon: string = (globalThis as any).WEBGEN_ICON;
    const mapping: { [ type in CommonIconType ]: [ material: string, bootstrap: string ] } = {
        [ CommonIconType.ArrowDown ]: [ "expand_more", "chevron-down" ],
        [ CommonIconType.Done ]: [ "done", "check2" ],
        [ CommonIconType.Close ]: [ "close", "x-lg" ],
        [ CommonIconType.Download ]: [ "get_app", "cloud-download" ],
        [ CommonIconType.Edit ]: [ "edit", "pencil" ],
        [ CommonIconType.Delete ]: [ "delete", "trash" ]
    };

    return mapping![ icon ][ webgenIcon == "material" ? 0 : 1 ]
}
