import { SupportedThemes } from "./SupportedThemes";

export class Style {
    loadedCSS: string[]
    constructor() {
        this.loadedCSS = ["master", "cards", "elements", "search", "nav", "modern"];
        var csslinks = document.createElement("csslinks");
        var theme = document.createElement("theme");
        document.getElementsByTagName("head")[0].append(csslinks)
        document.getElementsByTagName("head")[0].append(theme);
    }
    setTheme(theme: SupportedThemes) {

    }
    load() {

    }

}