import '../assets/font/font.css';
import './css/00.colors.css';
import './css/master.css';
import './css/modern.css';
import './css/webgen.static.css';
import { Style } from './Style.ts';
import { SupportedThemes } from './SupportedThemes.ts';
import { ColorDef } from "./types.ts";
export * from './Color.ts';
export * from "./Component.ts";
export * from "./Components.ts";
export * from "./components/Cache.ts";
export * from './components/Checkbox.ts';
export * from './components/Custom.ts';
export * from "./components/Flow.ts";
export * from './components/Form.ts';
export * from './components/FormDropDownInput.ts';
export * from "./components/FormInputs.ts";
export * from './components/FormText.ts';
export * from "./components/Image.ts";
export * from "./components/Scrollable.ts";
export * from './components/Switch.ts';
export * from './components/Tab.ts';
export * from "./components/Table.ts";
export * from "./components/Taglist.ts";
export * from './Helper.ts';
export * from "./State.ts";
export * from './Style.ts';
export { SupportedThemes } from './SupportedThemes.ts';
export * from './Validate.ts';

export * from './types.ts';

export type WebGenOptions = {
    updateThemeOnInit?: false,
    primaryColor?: `hsl(${number}, ${number}%, 40%)`,
    colors?: ColorDef,
    events?: {
        "themeChanged"?: (data: SupportedThemes, options: Style) => void;
        "themeRefreshed"?: (data: SupportedThemes, options: Style) => void;
    },
    theme?: SupportedThemes,
    defaultElementToHookStylesIn?: HTMLElement;
};

export const WebGen = (options: WebGenOptions = {}) => {
    console.log("Loaded @lucsoft/webgen");
    const theme = new Style(options);

    if (options.updateThemeOnInit ?? true)
        theme.updateTheme(options.theme ?? SupportedThemes.auto);

    return {
        theme
    };
};


export const animate = (callback: () => void) => {
    if ('startViewTransition' in document) {
        document.startViewTransition(() => callback());
    } else {
        callback();
    }
};