import { Style } from './lib/Style.ts';
import { SupportedThemes } from './lib/SupportedThemes.ts';
export { SupportedThemes } from './lib/SupportedThemes.ts';
import './css/00.colors.css';
import './css/webgen.static.css';
import './css/master.css';
import './css/modern.css';
import '../assets/font/font.css';
import { Icons } from "./lib/icons/none.ts";
import { ColorDef } from "./types.ts";
export * from './components/Components.ts';
export * from './components/Helper.ts';
export * from './components/generic/PlainText.ts';
export * from './components/generic/Tab.ts';
export * from './components/generic/Form.ts';
export * from "./components/generic/FormInputs.ts";
export * from './components/generic/Checkbox.ts';
export * from './components/generic/FormText.ts';
export * from './components/generic/Icon.ts';
export * from './components/generic/IconButton.ts';
export * from './components/generic/Custom.ts';
export * from './components/generic/Card.ts';
export * from './components/generic/Stacks.ts';
export * from './components/generic/Button.ts';
export * from "./components/generic/Wizard.ts";
export * from "./components/generic/ReCache.ts";
export * from "./components/generic/Layer.ts";
export * from "./components/generic/MediaQuery.ts";
export * from "./components/generic/Table.ts";
export * from "./components/generic/Image.ts";
export * from './components/light-components/loadingWheel.ts';
export * from './types.ts';
export * from './lib/icons/BootstrapIcons.ts';
export * from './lib/icons/MaterialIcons.ts';
export * from './lib/View.ts';
export * from './lib/Dialog.ts';
export * from './lib/Color.ts';
export * from "./State.ts";
export * from "./Components.ts";

export type WebGenOptions = {
    updateThemeOnInit?: false,
    primiaryColor?: string,
    colors?: ColorDef,
    icon?: Icons,
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
