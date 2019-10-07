import { ElementResponse } from "./ElementsResponse";
declare class Tiny {
    cardProgress(id: string): string;
    format(text: string): string;
    enableDrag(id: string): void;
}
/**
* TODO: Add Uploader
*       Add appList
*       Add imgList
*/
export declare class WebGenElements {
    ele: HTMLElement;
    tiny: Tiny;
    constructor(element: HTMLElement);
    private getID;
    private getMaterialIcon;
    style(style: string): void;
    bigTitle(settings: {
        img: string | undefined;
        title: string;
        subtitle: string | "";
        spaceingTop: string | undefined;
    }): ElementResponse;
    note(settings: {
        type: "home" | "fire" | "error" | "warn" | "developer";
        text: string;
    }): ElementResponse;
    player(settings: {
        small: true | false;
        img: string;
        onInput: (type: "play" | "pause" | "next" | "previous" | "search", args: string) => any;
    }): ElementResponse;
    cards(settings: {
        small: boolean;
        hidden: boolean;
        columns: "auto" | "1" | "2" | "3" | "4" | "5";
        maxWidth: false | string | "default";
        cards: {
            title: string;
            id: string;
            subtitle: string | false;
        }[];
    }): ElementResponse;
    title(settings: {
        title: string;
        subtitle: string | false;
    }): ElementResponse;
    search(settings: {
        type: "smart" | "default";
        maxWidth: false | string | "default";
        onclose: () => any;
        placeholder: string;
        notfound: string;
        onsearch: (text: string) => any;
        drawList: (input: string) => any;
        allowed: {
            donwload: boolean;
            edit: boolean;
            remove: boolean;
        };
        actions: {
            click: (arg: string) => any;
            download: (arg: string) => any;
            edit: (arg: string) => any;
            remove: (arg: string) => any;
        };
        index: {
            name: string;
            icon: string | false;
            tags: string[];
            category: string | false;
            text: string | false;
            id: string;
        }[];
    }): ElementResponse;
    buttons(settings: {
        big: boolean;
        list: {
            text: string;
            onclick: (e: HTMLButtonElement) => any;
        }[];
    }): ElementResponse;
    login(settings: {
        text: string;
        url: false | string;
        email: false | string;
        button: string;
        login: (password: HTMLInputElement, email: HTMLInputElement, url: HTMLInputElement, master: HTMLElement) => any;
    }): ElementResponse;
    window(settings: {
        maxWidth: false | string | "default";
        title: string | false;
        buttons: {
            color: string;
            text: string;
            onclick: string;
        }[] | false;
        content: string | HTMLElement;
    }): ElementResponse;
}
export {};
