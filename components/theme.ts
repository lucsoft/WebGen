import { asWebGenComponent, Component } from "../core/components.ts";
import { BoxComponent } from "../core/layout/box.ts";
import { alwaysRef, asRef, listen, Refable, Reference } from "../core/state.ts";
import { isDarkModePreferred } from "./misc/themeQuery.ts";
import { wgStyleValues } from "./styles.ts";

export enum ThemeMode {
    Auto = "auto",
    Light = "light",
    Dark = "dark"
}

@asWebGenComponent("theme")
export class WebGenThemeComponent extends BoxComponent {
    #themeMode = asRef(ThemeMode.Auto);
    #primaryColor = asRef<string | undefined>(undefined);
    #fontFamily = asRef("system-ui,sans-serif");

    constructor(component: Reference<Component[] | Component> | Component, components: Component[]) {
        super(component, components);
        const meta = document.createElement("meta");
        meta.name = "color-scheme";
        document.adoptedStyleSheets.push(wgStyleValues);
        this.useListener(this.#themeMode, (current) => {
            if (current === ThemeMode.Auto) {
                meta.content = "dark light";
            }
            else {
                meta.content = current;
            }
        });
        document.head.append(meta);

        const font = document.createElement("style");

        this.useListener(this.#fontFamily, (current) => {
            font.textContent = `body {
                font-family: ${current};
                margin: 0;
            }`;
        });

        document.head.append(font);
        const colors = document.createElement("style");

        this.addWatch(() => {
            return listen(() => {
                const theme = this.#themeMode.value === ThemeMode.Auto ? (isDarkModePreferred.value ? ThemeMode.Dark : ThemeMode.Light) : this.#themeMode.value;
                document.querySelector("html")!.setAttribute("data-theme", theme);
                colors.textContent = `
                    html {
                        --wg-primary: var(--wg-override-primary, oklch(83.53% 0.207 169.23));
                        --wg-primary-text: var(--wg-override-primary-text, var(--wg-black));
                        --wg-black: var(--wg-override-black, color-mix(in oklab, hsl(0deg 0% 10%), var(--wg-primary) 3%));
                        --wg-white: var(--wg-override-white, color-mix(in oklab, hsl(0deg 0% 90%), var(--wg-primary) 10%));

                        --wg-neutral: var(--wg-override-neutral, ${theme === ThemeMode.Dark ? "var(--wg-white)" : "var(--wg-black)"});
                        --wg-reverse-neutral: var(--wg-override-reverse-neutral, ${theme === ThemeMode.Dark ? "var(--wg-black)" : "var(--wg-white)"});
                    }
                    [data-theme="light"] body
                    {
                        --wg-primary: color-mix(in oklab, var(--wg-override-primary, oklch(83.53% 0.207 169.23)), var(--wg-black) 50%);
                        --wg-primary-text: color-mix(in oklab, var(--wg-override-primary-text, var(--wg-black)), var(--wg-white) 100%);
                    }
                    body {
                        background-color: color-mix(in oklab, var(--wg-reverse-neutral), black 10%);
                        color: var(--wg-neutral);
                    }
                `;
            });
        });

        document.head.append(colors);

        const defaultColor = document.createElement("style");
        this.useListener(this.#primaryColor, (current) => {
            if (current) {
                defaultColor.textContent = `:root {
                    --wg-override-primary: ${current};
                }`;
            }
        });
        document.head.append(defaultColor);
    }

    override make() {
        const obj = {
            ...super.make(),
            useGrayscaleColor: () => {
                this.addWatch(() => listen(() => {
                    const theme = this.#themeMode.value === ThemeMode.Auto ? (isDarkModePreferred.value ? ThemeMode.Dark : ThemeMode.Light) : this.#themeMode.value;

                    this.#primaryColor.value = theme === ThemeMode.Dark ? "hsl(0, 0%, 90%)" : "hsl(0, 0%, 0%)";
                }));
                return obj;
            },
            setPrimaryColor: (color: Refable<string>) => {
                this.useListener(alwaysRef(color), (current) => {
                    this.#primaryColor.value = current;
                });
                return obj;
            },
            useAltLayout: () => {
                document.body.style.display = "grid";
                document.body.style.height = "100dvh";
                document.body.style.gridTemplate = "100% / 100%";

                this.style.display = "grid";
                this.style.width = "100%";
                this.style.height = "100%";
                this.style.gridTemplate = "100% / 100%";
                return obj;
            }
        };
        return obj;
    }
}

export function WebGenTheme(component: Reference<Component[] | Component> | Component, ...components: Component[]) {
    return new WebGenThemeComponent(component, components).make();
}