import '../css/webgen.static.css';

import '../css/cards.webgen.static.css';
import '../css/cards.lline.webgen.static.css';
import '../css/cards.modern.webgen.static.css';
import '../css/cards.rich.webgen.static.css';
import '../css/cards.note.webgen.static.css';
import '../css/search.webgen.static.css';

import '../css/elements.css';
import '../css/grouping.css';
import '../css/master.css';
import '../css/modern.css';

import { blur, dark, white } from '../css/themes';
import { SupportedThemes } from './SupportedThemes';

export class Style
{
    private head = document.head;
    private theme: HTMLStyleElement;
    private hooks: ((current: SupportedThemes, isAuto: boolean) => void)[] = [];
    constructor(autoLoadFonts: boolean)
    {
        if (autoLoadFonts)
        {
            var roboto = document.createElement('link');
            roboto.rel = "stylesheet";
            roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300,500|Material+Icons|Material+Icons+Round&display=swap";

            this.head?.append(roboto);
        }
        this.theme = document.createElement('style')
        this.theme.id = 'theme';
        this.head.appendChild(this.theme);

    }
    hookThemeChange(action: (current: SupportedThemes, isAuto: boolean) => void)
    {
        this.hooks.push(action);
    }
    getImage = (): string | undefined => { return undefined; }
    private current: SupportedThemes | undefined = undefined;
    handleTheme(theme: SupportedThemes, isAuto: boolean = false)
    {
        if (!this.head) return;
        switch (theme)
        {
            case SupportedThemes.gray:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = "";
                this.current = theme;
                this.hooks.forEach(x => x(theme, isAuto));
                break;
            case SupportedThemes.blur:
                if (this.current == theme)
                    return;
                const image = this.getImage();
                if (image === undefined)
                {
                    console.error('Blur requires to set an image use .getImage = () => "url|base64Image"')
                    return;
                }
                this.theme.innerHTML = blur.replace('%base64Image%', `'${image}'`);
                this.current = theme;
                this.hooks.forEach(x => x(theme, isAuto));
                break;
            case SupportedThemes.dark:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = dark;
                this.current = theme;
                this.hooks.forEach(x => x(theme, isAuto));
                break;
            case SupportedThemes.white:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = white;
                this.current = theme;
                this.hooks.forEach(x => x(theme, isAuto));
                break;
            case SupportedThemes.auto:
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                this.handleTheme(mediaQuery.matches ? SupportedThemes.dark : SupportedThemes.white, true);

                mediaQuery.addEventListener('change', e =>
                    this.handleTheme(e.matches ? SupportedThemes.dark : SupportedThemes.white, true));
                break;
            default:
                break;
        }
    }
}