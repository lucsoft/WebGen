import '../css/cards.css';
import '../css/elements.css';
import '../css/grouping.css';
import '../css/master.css';
import '../css/modern.css';
import '../css/nav.css';
import '../css/search.css';
import '../css/sidebar.css';
import '../css/unit.css';

import { base64Image } from '../css/image';
import { blur, dark, white } from '../css/themes';
import { SupportedThemes } from './SupportedThemes';

export class Style
{
    private head = document.head;
    private theme: HTMLStyleElement;
    private hooks: ((current: SupportedThemes, isAuto: boolean) => void)[] = [];
    constructor()
    {
        var roboto = document.createElement('link');
        roboto.rel = "stylesheet";
        roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300,500|Material+Icons|Material+Icons+Round&display=swap";
        if (this.head)
            this.head.append(roboto);

        this.theme = document.createElement('style')
        this.theme.id = 'theme';
        this.head.appendChild(this.theme);

    }
    hookThemeChange(action: (current: SupportedThemes, isAuto: boolean) => void)
    {
        this.hooks.push(action);
    }
    private current = SupportedThemes.notset;
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
                this.theme.innerHTML = blur.replace('%base64Image%', `'${base64Image}'`);
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
                if (window.matchMedia('(prefers-color-scheme: dark)').matches)
                    this.handleTheme(SupportedThemes.dark, true);
                else
                    this.handleTheme(SupportedThemes.white, true);

                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e =>
                {
                    if (e.matches)
                        this.handleTheme(SupportedThemes.dark, true)
                    else
                        this.handleTheme(SupportedThemes.white, true)
                });
                break;
            default:
                break;
        }
    }
}