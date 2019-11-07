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
    constructor()
    {
        var roboto = document.createElement('link');
        roboto.rel = "stylesheet";
        roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300|Material+Icons|Material+Icons+Round";
        document.querySelector('head')?.append(roboto);
    }
    loadTheme(theme: SupportedThemes)
    {
        switch (theme)
        {
            case SupportedThemes.blur:
                var themeStyle = document.createElement('style');
                themeStyle.innerHTML = blur.cssText.replace('%base64Image%', `'${base64Image}'`);
                themeStyle.id = 'blurStyle';
                document.querySelector('head')?.appendChild(themeStyle);
                break;

            case SupportedThemes.dark:
                var themeStyle = document.createElement('style');
                themeStyle.innerHTML = dark.cssText;
                themeStyle.id = 'darkStyle';
                document.querySelector('head')?.appendChild(themeStyle);
                break;
            case SupportedThemes.white:
                var themeStyle = document.createElement('style');
                themeStyle.innerHTML = white.cssText;
                themeStyle.id = 'whiteStyle';
                document.querySelector('head')?.appendChild(themeStyle);
                break;
            default:
                break;
        }
    }
}