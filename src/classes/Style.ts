import { SupportedThemes } from "./SupportedThemes";

export enum availableStyles {
    cards = "../css/cards.css"
}
export class Style {
    loadedCSS: availableStyles[]
    constructor() {
        this.loadedCSS = [];
        var csslinks = document.createElement("csslinks");
        var theme = document.createElement("theme");
        document.getElementsByTagName("head")[0].append(csslinks)
        document.getElementsByTagName("head")[0].append(theme);
    }
    setTheme(theme: SupportedThemes) {
        switch (theme) {
            case SupportedThemes.dark:
                console.log('test');
                this.load('../css/dark.css');
                break;
            case SupportedThemes.white:
                console.log('white');
                this.load('../css/white.css');
                break;
            case SupportedThemes.blur:
                console.log('blur');
                this.load('../css/blur.css');
                break;

            default:
                break;
        }
    }
    require(style: availableStyles) {
        if (this.loadedCSS.indexOf(style) == -1) {
            this.load(style);
        }
    }
    loadDefaults() {
        const defaults = ["../css/master.css", "../css/elements.css"];
        defaults.forEach((element) => {
            this.load(element);
        })
    }
    load(url: string) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", url)
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

}