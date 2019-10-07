"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Style {
    constructor() {
        this.loadedCSS = ["master", "cards", "elements", "search", "nav", "modern"];
        var csslinks = document.createElement("csslinks");
        var theme = document.createElement("theme");
        document.getElementsByTagName("head")[0].append(csslinks);
        document.getElementsByTagName("head")[0].append(theme);
    }
    setTheme(theme) {
    }
    load() {
    }
}
exports.Style = Style;
