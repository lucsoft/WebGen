import { Elements } from './lib/Elements';
import { Style } from './lib/Style';
import { SupportedThemes } from './lib/SupportedThemes';
export * as WebFunctions from './lib/Functions';
export { SupportedThemes } from './lib/SupportedThemes';
export { WebGenElements } from './lib/WebGenElements';
export * from './cards/searchCard';
export * from './cards/defaultCard';
export * from './cards/headlessCard';
export * from './cards/loginCard';
export * from './cards/modernCard';
export * from './cards/noteCard';
export * from './cards/richCard';
type themes = { theme: SupportedThemes.blur, autoLoadFonts?: boolean, image: () => string } | { theme?: Exclude<SupportedThemes, SupportedThemes.blur>, autoLoadFonts?: boolean, image?: () => string };

export * from './components'
export class WebGen
{
    style: Style;
    elements: Elements;

    /**
     * @param options Image is required when using Blur Theme
     */
    constructor(options: themes = {})
    {
        console.log("Loaded @lucsoft/webgen");
        this.style = new Style(options.autoLoadFonts ?? true, options.image ?? (() => ''));
        this.elements = new Elements(this.style);
        this.style.handleTheme(options.theme ?? SupportedThemes.auto);
    }
}
