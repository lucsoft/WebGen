import { Style } from './lib/Style'
import { SupportedThemes } from './lib/SupportedThemes'
export { SupportedThemes } from './lib/SupportedThemes'
import './css/webgen.static.css'
import './css/elements.css'
import './css/grouping.css'
import './css/master.css'
import './css/modern.css'
import { Icons } from "./lib/icons/none"
import { ColorDef } from "./types"
export * from './components/Components'
export * from './components/Helper'
export * from './components/cards/defaultCard'
export * from './components/cards/headlessCard'
export * from './components/cards/loginCard'
export * from './components/cards/modernCard'
export * from './components/cards/noteCard'
export * from './components/cards/richCard'
export * from './components/generic/PlainText'
export * from './components/generic/Tab'
export * from './components/generic/Checkbox'
export * from './components/generic/Input'
export * from './components/generic/Icon'
export * from './components/generic/IconButton'
export * from './components/generic/Custom'
export * from './components/generic/Card'
export * from './components/generic/Stacks'
export * from './components/generic/Button'
export * from './components/generic/DropDown'
export * from './components/light-components/loadingWheel'
export * from './types'
export * from './lib/icons/BootstrapIcons'
export * from './lib/icons/MaterialIcons'
export * from './lib/RenderingX'
export * from './lib/View'
export * from './lib/Dialog'
export * from './lib/Color'

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
