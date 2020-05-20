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
    current = SupportedThemes.notset;
    handleTheme(theme: SupportedThemes)
    {
        if (!this.head) return;
        switch (theme)
        {
            case SupportedThemes.gray:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = "";
                this.current = theme;
                break;
            case SupportedThemes.blur:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = blur.replace('%base64Image%', `'${base64Image}'`);
                this.current = theme;
                break;

            case SupportedThemes.dark:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = dark;
                this.current = theme;
                break;
            case SupportedThemes.white:
                if (this.current == theme)
                    return;
                this.theme.innerHTML = white;
                this.current = theme;
                break;
            case SupportedThemes.auto:
                if (window.matchMedia('(prefers-color-scheme: dark)').matches)
                    this.handleTheme(SupportedThemes.dark);
                else
                    this.handleTheme(SupportedThemes.white);

                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e =>
                {
                    if (e.matches)
                        this.handleTheme(SupportedThemes.dark)
                    else
                        this.handleTheme(SupportedThemes.white)
                });
                break;
            default:
                break;
        }
    }
}