import "babel-polyfill";
import { WebGen } from "../webgen";
import { SupportedThemes } from "../classes/SupportedThemes";
var web: WebGen = new WebGen();

web.ready = () => {
    web.elements.add(web.functions.getBody()).bigTitle({
        title: "water"
    }).next.window({
        title: 'miau',
        content: 'lol'
    });
};
document.addEventListener("DOMContentLoaded", () => web.enable(SupportedThemes.blur));