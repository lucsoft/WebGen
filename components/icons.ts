import { asWebGenComponent, HTMLComponent } from "../core/components.ts";
import { css } from "../core/cssTemplate.ts";
import { lazy } from "../core/lazy.ts";
import { asRef, listen } from "../core/state.ts";

export const IconType = {
    bootstrap: await import("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/bootstrap-icons.svg").then(x => 'default' in x ? x.default as string : undefined!),
    materialSymbol: lazy(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.23.0/rounded.css")),
};

@asWebGenComponent("icon")
export class IconComponent extends HTMLComponent {
    static weight = asRef(400);
    static grade = asRef(-25);
    static size = asRef(24);
    static fill = asRef<0 | 1>(0);

    constructor(type: keyof typeof IconType, icon: string) {
        super();

        if (type === "bootstrap") {
            const data = IconType[ type ];
            this.addWatch(() => listen(() => {
                this.shadowRoot!.innerHTML += `
                    <svg width="${IconComponent.size.value - 4}" height="${IconComponent.size.value - 4}" style="box-sizing: border-box;margin-top: 1px;" fill="currentColor">
                        <use xlink:href="${data.replace("./", "/")}#${icon}"/>
                    </svg>
                `;
            }));
        }
        else {
            IconType[ type ]();

            this.shadowRoot?.adoptedStyleSheets.push(css`
                :host {
                    font-family: "Material Symbols Rounded";
                    font-weight: normal;
                    font-style: normal;
                    font-size: 24px;
                    line-height: 1;
                    letter-spacing: normal;
                    text-transform: none;
                    display: inline-block;
                    white-space: nowrap;
                    word-wrap: normal;
                    direction: ltr;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                    font-feature-settings: "liga";
                }
            `);

            this.shadowRoot?.append(icon);
        }

        const style = new CSSStyleSheet();
        this.shadowRoot?.adoptedStyleSheets.push(style);
        this.addWatch(() => listen(() => {
            style.replaceSync(`
                :host {
                    font-variation-settings:
                    'FILL' ${IconComponent.fill.value},
                    'wght' ${IconComponent.weight.value},
                    'GRAD' ${IconComponent.grade.value},
                    'opsz' ${IconComponent.size.value}
                }
            `);
        }));
    }
}

export function MaterialIcon(icon: string) {
    return new IconComponent("materialSymbol", icon).make();
}

export function BootstrapIcon(icon: string) {
    return new IconComponent("bootstrap", icon).make();
}