declare class Style {
    loadedCSS: string[];
    constructor();
    setTheme(theme: SupportedThemes): void;
    load(): void;
}
declare class Script {
    constructor();
    load(url: string): Promise<unknown>;
}
export declare enum SupportedThemes {
    notset = "",
    white = "white",
    gray = "gray",
    dark = "dark",
    blur = "blur"
}
declare class Config {
    defaultBackground: SupportedThemes;
}
declare class ElementModifyer {
    element: HTMLElement;
    constructor(element: HTMLElement);
    addClass(name: string): this;
    removeClass(name: string): this;
    setID(id: string): void;
}
declare class ElementResponse {
    e: WebGenElements;
    id: string;
    mod: ElementModifyer;
    constructor(elements: WebGenElements, element: HTMLElement);
}
/**
* TODO: Add Uploader
*       Add appList
*       Add imgList
*/
declare class WebGenElements {
    ele: HTMLElement;
    constructor(element: HTMLElement);
    private getID;
    private getMaterialIcon;
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
        login: (password: HTMLInputElement, email: HTMLInputElement, url: HTMLInputElement) => any;
    }): ElementResponse;
    window(settings: {
        maxWidth: false | string;
        title: string | false;
        buttons: {
            color: string;
            text: string;
            onclick: string;
        }[] | false;
        content: string | HTMLElement;
    }): ElementResponse;
}
declare class Elements {
    layout(id: string, remove?: true | false): {
        element: ElementModifyer;
    } | undefined;
    add(addto?: {
        type: "id" | "firstTag";
        name: string;
    }): WebGenElements | undefined;
}
declare class Functions {
    private urlParams;
    encrypt(str: string): string;
    decrypt(msg: string): string;
    getPara(type: string): string | null;
    setPara(name: string, val: string): void;
}
export declare class WebGen {
    style: Style;
    script: Script;
    config: Config;
    func: Functions;
    ready: Function;
    ele: Elements;
    enable(): void;
    setDatabase(): void;
    constructor();
}
export {};
