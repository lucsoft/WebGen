import { Style } from './lib/Style';
import { SupportedThemes } from './lib/SupportedThemes';
export { SupportedThemes } from './lib/SupportedThemes';
import './css/webgen.static.css';

import './css/elements.css';
import './css/grouping.css';
import './css/master.css';
import './css/modern.css';

export * from './components/Components'
export * from './components/Helper'
export * from './components/cards/searchCard'
export * from './components/cards/defaultCard'
export * from './components/cards/headlessCard'
export * from './components/cards/loginCard'
export * from './components/cards/modernCard'
export * from './components/cards/noteCard'
export * from './components/cards/richCard'
export * from './components/cards/searchCard'
export * from './components/generic/Title'
export * from './components/generic/Custom'
export * from './components/generic/Card'
export * from './components/generic/PageTitle'
export * from './components/generic/Button'
export * from './components/light-components/loadingWheel';
export * from './types'
export * from './lib/RenderingX';
export * from './lib/View';
export * from './lib/Dialog';

export type WebGenOptions = {
    autoLoadFonts?: boolean,
    updateThemeOnInit?: false,
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
