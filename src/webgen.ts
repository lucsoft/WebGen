import { Style } from './lib/Style.ts'
import { SupportedThemes } from './lib/SupportedThemes.ts'
export { SupportedThemes } from './lib/SupportedThemes.ts'
import './css/webgen.static.css'
import './css/elements.css'
import './css/master.css'
import './css/modern.css'
import { Icons } from "./lib/icons/none.ts"
import { ColorDef } from "./types.ts"
export * from './components/Components.ts'
export * from './components/Helper.ts'
export * from './components/cards/defaultCard.ts'
export * from './components/cards/headlessCard.ts'
export * from './components/cards/loginCard.ts'
export * from './components/cards/modernCard.ts'
export * from './components/cards/noteCard.ts'
export * from './components/cards/richCard.ts'
export * from './components/generic/PlainText.ts'
export * from './components/generic/Tab.ts'
export * from './components/generic/Form.ts';
export * from './components/generic/Checkbox.ts'
export * from './components/generic/Input.ts'
export * from './components/generic/Icon.ts'
export * from './components/generic/IconButton.ts'
export * from './components/generic/Custom.ts'
export * from './components/generic/Card.ts'
export * from './components/generic/Stacks.ts'
export * from './components/generic/Button.ts'
export * from "./components/generic/FromInputs.ts";
export * from './components/light-components/loadingWheel.ts'
export * from './types.ts'
export * from './lib/icons/BootstrapIcons.ts'
export * from './lib/icons/MaterialIcons.ts'
export * from './lib/View.ts'
export * from './lib/Dialog.ts'
export * from './lib/Color.ts'

export type WebGenOptions = {
    autoLoadFonts?: boolean,
    updateThemeOnInit?: false,
    colors?: ColorDef,
    icon?: Icons,
    events?: {
        "themeChanged"?: (data: SupportedThemes, options: Style) => void;
        "themeRefreshed"?: (data: SupportedThemes, options: Style) => void;
    },
    theme?: SupportedThemes,
    defaultElementToHookStylesIn?: HTMLElement
};

export const WebGen = (options: WebGenOptions = {}) => {
    console.log("Loaded @lucsoft/webgen");
    const theme = new Style(options);

    if (options.updateThemeOnInit ?? true)
        theme.updateTheme(options.theme ?? SupportedThemes.auto);

    return {
        theme
    }
}
