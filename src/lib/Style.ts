import { blur, dark, white } from '../css/themes';
import { SupportedThemes } from './SupportedThemes';
import { createElement } from "../components/Components";
import { WebGenOptions } from "../webgen";

export class Style {
    private theme: HTMLElement;
    private current: SupportedThemes = SupportedThemes.gray;
    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    private options: WebGenOptions;

    constructor(options: WebGenOptions) {
        const styleAppendTo = options.defaultElementToHookStylesIn ?? document.documentElement;
        this.options = options;
        if (options.autoLoadFonts ?? true) {
            var roboto = createElement('link') as HTMLLinkElement;
            roboto.rel = "stylesheet";
            roboto.href = "https://fonts.googleapis.com/css?family=Roboto:100,200,300,400,500|Material+Icons+Round&display=swap";
            styleAppendTo.append(roboto);
        }
        this.theme = styleAppendTo;
        this.mediaQuery.addEventListener('change', e => {
            if (this.current == SupportedThemes.autoDark || this.current == SupportedThemes.autoWhite)
                this.updateTheme(e.matches ? SupportedThemes.autoDark : SupportedThemes.autoWhite)
        });
    }

    setImage(src: String) {
        document.body.style.background = `url(${src}) no-repeat center center fixed`;
        document.body.style.backgroundAttachment = "cover";
    }

    clearImage() {
        document.body.style.background = "";
    }

    overrideTheme(data: { [ key in string ]: string }) {
        const dataWithDefaults = {
            ...this.getMapping()[ this.current ],
            ...data
        };
        Object.entries(dataWithDefaults).forEach(([ key, value ]) => this.theme.style.setProperty(key, value))
    }

    updateTheme(theme: SupportedThemes) {
        this.options.events?.themeRefreshed?.(theme, this);
        if (theme === SupportedThemes.auto)
            this.updateTheme(this.mediaQuery.matches ? SupportedThemes.autoDark : SupportedThemes.autoWhite);
        else {
            if (this.current == theme) return;
            Object.entries(this.getMapping()[ theme ]!).forEach(([ key, value ]) => this.theme.style.setProperty(key, value))
            this.current = theme;
            this.options.events?.themeChanged?.(theme, this);
        }
    }

    private getMapping = (): { [ theme in SupportedThemes ]?: { [ key in string ]: string } } => ({
        [ SupportedThemes.white ]: white,
        [ SupportedThemes.gray ]: {},
        [ SupportedThemes.dark ]: dark,
        [ SupportedThemes.blur ]: blur,
        [ SupportedThemes.autoWhite ]: white,
        [ SupportedThemes.autoDark ]: dark,
    });
}