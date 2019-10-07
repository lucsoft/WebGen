import { SupportedThemes } from "./SupportedThemes";
export declare class Style {
    loadedCSS: string[];
    constructor();
    setTheme(theme: SupportedThemes): void;
    load(): void;
}
