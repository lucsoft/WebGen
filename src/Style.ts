import { Color } from "./Color.ts";
import { css } from "./Components.ts";
import { SupportedThemes } from './SupportedThemes.ts';
import { blur, dark, light } from './css/themes.ts';
import { ColorDef } from "./types.ts";
import { WebGenOptions } from "./webgen.ts";

export class Style {
    private theme: HTMLElement;
    private current: SupportedThemes = SupportedThemes.gray;
    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    private options: WebGenOptions;

    constructor(options: WebGenOptions) {
        const styleAppendTo = options.defaultElementToHookStylesIn ?? document.documentElement;
        this.options = options;
        this.theme = styleAppendTo;
        const data = (options.primiaryColor ?? "hsl(200, 50%, 40%)")?.match(/hsl\((?<hue>\d+), (?<saturation>\d+%), .*%\)/);
        if (!(data && data.groups && data.groups.hue && data.groups.saturation)) throw new Error("Bad Primary Color");
        document.adoptedStyleSheets.push(css`:root{ --webgen-primary-hue: ${data.groups.hue}; --webgen-primary-sat: ${data.groups.saturation};}`);

        this.mediaQuery.addEventListener('change', e => {
            if (this.current == SupportedThemes.autoDark || this.current == SupportedThemes.autoLight)
                this.updateTheme(e.matches ? SupportedThemes.autoDark : SupportedThemes.autoLight);
        });
    }

    getTheme = () => this.current;
    getColors = (): ColorDef => ({
        [ Color.Critical ]: [ 360, 86, 65, "#333333" ],
        [ Color.Colored ]: [ 227, 85, 65, "#FFFFFF" ],
        [ Color.Grayscaled ]: [ 0, 0, 100, "#333333" ],
        [ Color.Disabled ]: [ 0, 0, 75, "#A0A0A0" ],
    });

    overrideTheme(data: { [ key in string ]: string }) {
        const dataWithDefaults = {
            ...this.getMapping()[ this.current ],
            ...data
        };
        this.applyStyles(dataWithDefaults);
    }

    private mapColorDef(data: ColorDef) {
        const object: { [ key in string ]: string } = {};
        Object.entries(data).forEach(([ color, values ]) => {
            const indexToName = [ "hue", "saturation", "lightness", "font" ];
            values.forEach((value, index) => {
                object[ `--color-${color}-${indexToName[ index ]}` ] = value.toString() + ([ "deg", "%", "%", "" ][ index ]);
            });
        });
        return object;
    }

    private applyStyles(data: { [ x: string ]: string; }) {
        const extendData = {
            ...this.mapColorDef(this.getColors()),
            ...data
        };
        Object.entries(extendData).forEach(([ key, value ]) => this.theme.style.setProperty(key, value));
    }

    updateTheme(theme: SupportedThemes) {
        this.options.events?.themeRefreshed?.(theme, this);
        if (theme === SupportedThemes.auto)
            this.updateTheme(this.mediaQuery.matches ? SupportedThemes.autoDark : SupportedThemes.autoLight);
        else {
            if (this.current == theme) return;
            if (theme === SupportedThemes.gray) this.theme.removeAttribute("style");
            this.applyStyles(this.getMapping()[ theme ]!);
            document.body.setAttribute("data-theme", theme == SupportedThemes.light || theme == SupportedThemes.autoLight ? "light" : "dark");
            this.current = theme;
            this.options.events?.themeChanged?.(theme, this);
        }
    }

    private getMapping = (): { [ theme in SupportedThemes ]?: { [ key in string ]: string } } => ({
        [ SupportedThemes.light ]: light,
        [ SupportedThemes.gray ]: {},
        [ SupportedThemes.dark ]: dark,
        [ SupportedThemes.blur ]: blur,
        [ SupportedThemes.autoLight ]: light,
        [ SupportedThemes.autoDark ]: dark,
    });
}