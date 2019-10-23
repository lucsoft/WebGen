import "babel-polyfill";
import { WebGen } from "../index";
import { SupportedThemes } from "../classes/SupportedThemes";
var web: WebGen = new WebGen();

web.ready = () => {
    web.style.setTheme(SupportedThemes.dark);
};
web.enable();