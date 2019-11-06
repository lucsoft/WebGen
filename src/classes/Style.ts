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
        this.loadDefaults();
    }


    loadDefaults() {
        const defaults = ["../css/master.css", "../css/elements.css", "../css/cards.css"];
        defaults.forEach((element) => {
            this.load(element);
            console.log(element);
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