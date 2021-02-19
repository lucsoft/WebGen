import { Elements } from './lib/Elements';
import { Style } from './lib/Style';
import { SupportedThemes } from './lib/SupportedThemes';
export * as WebFunctions from './lib/Functions';
export { EmailPasswordAuth, IDTokenAuth, ProfileData, User } from './lib/ProfileData';
export { SupportedThemes } from './lib/SupportedThemes';
export { WebGenElements } from './lib/WebGenElements';
export * from './cards'
export * from './components'
export class WebGen
{
    style: Style;
    elements: Elements;
    constructor(options: { theme?: SupportedThemes, autoLoadFonts?: boolean } = {})
    {
        console.log("Loaded %cWebGen%cNPM", 'font-size: 2rem', 'font-size: 1.7rem;padding-left: 0.4rem;color:rgb(200,0,0)');
        this.style = new Style(options.autoLoadFonts ?? true);
        this.elements = new Elements(this.style);

        this.style.handleTheme(options.theme ?? SupportedThemes.auto);
    }
}
