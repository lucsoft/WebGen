import '../css/master.css';
import '../css/elements.css';
import '../css/cards.css';
import '../css/grouping.css';
import '../css/nav.css';
import '../css/search.css';
import '../css/sidebar.css';
import '../css/unit.css';

import { base64Image } from '../css/image';
import { blur, dark, white } from '../css/themes';
import { SupportedThemes } from './SupportedThemes';

export class Style
{
    private head = document.querySelector('head');
    constructor()
    {
        var roboto = document.createElement('link');
        roboto.rel = "stylesheet";
        roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300,500|Material+Icons|Material+Icons+Round&display=swap";
        this.head = document.querySelector('head');
        if (this.head)
            this.head.append(roboto);
    }
    loadTheme(theme: SupportedThemes)
    {
        if (!this.head) return;
        switch (theme)
        {
            case SupportedThemes.blur:
                var themeStyle = document.createElement('style');
                themeStyle.innerHTML = blur.cssText.replace('%base64Image%', `'${base64Image}'`);
                themeStyle.id = 'blurStyle';
                this.head.appendChild(themeStyle);
                break;

            case SupportedThemes.dark:
                var themeStyle = document.createElement('style');
                themeStyle.innerHTML = dark.cssText;
                themeStyle.id = 'darkStyle';
                this.head.appendChild(themeStyle);
                break;
            case SupportedThemes.white:
                var themeStyle = document.createElement('style');
                themeStyle.innerHTML = white.cssText;
                themeStyle.id = 'whiteStyle';
                this.head.appendChild(themeStyle);
                break;
            default:
                break;
        }
    }
}