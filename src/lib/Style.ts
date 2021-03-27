import { blur, dark, white } from '../css/themes';
import { SupportedThemes } from './SupportedThemes';
import { createElement } from "../components/Components";

export class Style {
    private head = document.head;
    private theme: HTMLStyleElement;
    private current: SupportedThemes = SupportedThemes.gray;
    private hooks: ((current: SupportedThemes) => void)[] = [];
    private image: () => string;
    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    private emitEventOnSameThemeChange: boolean;
    constructor(autoLoadFonts: boolean, image: () => string, emitEventOnSameThemeChange: boolean) {
        this.image = image;
        this.emitEventOnSameThemeChange = emitEventOnSameThemeChange;
        if (autoLoadFonts) {
            var roboto = createElement('link') as HTMLLinkElement;
            roboto.rel = "stylesheet";
            roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500|Material+Icons+Round&display=swap";
            this.head?.append(roboto);
        }
        this.theme = createElement('style') as HTMLStyleElement
        this.head.appendChild(this.theme);
        this.mediaQuery.addEventListener('change', e => {
            if (this.current == SupportedThemes.autoDark || this.current == SupportedThemes.autoWhite)
                this.updateTheme(e.matches ? SupportedThemes.autoDark : SupportedThemes.autoWhite)
        });
    }

    onThemeUpdate = (action: (current: SupportedThemes) => void) => this.hooks.push(action)

    updateTheme(theme: SupportedThemes) {
        const mapping = {
            [ SupportedThemes.white ]: white,
            [ SupportedThemes.gray ]: "",
            [ SupportedThemes.dark ]: dark,
            [ SupportedThemes.blur ]: blur.replace('%base64Image%', `'${this.image()}'`),
            [ SupportedThemes.autoWhite ]: white,
            [ SupportedThemes.autoDark ]: dark,
        };
        switch (theme) {
            case SupportedThemes.dark:
            case SupportedThemes.white:
            case SupportedThemes.blur:
            case SupportedThemes.autoDark:
            case SupportedThemes.autoWhite:
            case SupportedThemes.gray:
                if (this.current == theme) {
                    if (this.emitEventOnSameThemeChange) this.hooks.forEach(x => x(theme));
                    return;
                }
                this.theme.innerHTML = mapping[ theme ];
                this.current = theme;
                this.hooks.forEach(x => x(theme));
                break;

            case SupportedThemes.auto:
                this.updateTheme(this.mediaQuery.matches ? SupportedThemes.autoDark : SupportedThemes.autoWhite);
                break;
            default:
                break;
        }
    }
}