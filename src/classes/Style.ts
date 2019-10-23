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
        switch (theme) {
            case SupportedThemes.dark:
                console.log('test');
                import('../css/dark.css');
                break;
            case SupportedThemes.white:
                console.log('white');
                import('../css/white.css');
                break;
            case SupportedThemes.blur:
                console.log('blur');
                import('../css/blur.css');
                break;

            default:
                break;
        }
    }
    load(url: string) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", url)
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

}