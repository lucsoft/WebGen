import { asRef, asWebGenComponent, Box, Color, css, HTMLComponent, type Component } from "../../core/mod.ts";

@asWebGenComponent("sheets")
export class SheetsComponent extends HTMLComponent {
    #count = asRef(0);
    constructor() {
        super();
        this.shadowRoot?.adoptedStyleSheets.push(css`
            :host {
                display: grid;
                grid-template: 1fr / 1fr;
                max-width: 100dvw;
                max-height: 100dvh;
                padding-top: 20px;
                box-sizing: border-box;
            }
            .sheet {
                grid-area: 1 / 1;
                background-color: ${Color.reverseNeutral.mix(Color.primary, `calc(3% * calc(4 - calc(var(--sheet-depth) * 2)))`)};
                padding: var(--wg-sheet-padding, 15px);
                border-radius: var(--wg-padding-radius, var(--wg-radius-large));
                overflow: auto;
                margin: calc(0px - var(--sheet-depth) * 8px) calc(var(--sheet-depth) * 8px) 0;
                opacity: 1;
                transition: background-color 250ms ease, margin 250ms ease;

                z-index: 1;
                translate: 0;
                animation: fadeIn 250ms ease;
            }
            @keyframes fadeIn {
                from {
                    translate: 0 30px;
                    opacity: 0.4;
                }
            }
        `);
    }

    private calculateDepth() {
        for (const [ index, element ] of Array.from(this.shadowRoot!.children).toReversed().entries()) {
            (element as HTMLElement).style.opacity = index > 2 ? "0" : "1";
            (element as HTMLElement).style.setProperty("--sheet-depth", `${index}`);
        }

    }

    override make() {
        const obj = {
            ...super.make(),
            addSheet: (sheet: Component) => {
                this.shadowRoot!.append(Box(sheet).addClass("sheet").draw());
                this.#count.value++;
                this.calculateDepth();
                return obj;
            },
            removeOne: () => {
                if (this.#count.value === 0) return obj;
                Array.from(this.shadowRoot!.children).at(-1)!.remove();
                this.#count.value--;
                this.calculateDepth();
                return obj;
            },
            removeAll: () => {
                this.shadowRoot!.innerHTML = "";
                this.#count.value = 0;
                this.calculateDepth();
                return obj;
            },
            visible: () => {
                const open = asRef<boolean>(this.#count.value > 0);
                this.useListener(open, value => {
                    if (!value) {
                        obj.removeAll();
                    }
                });
                this.useListener(this.#count.map((count) => count > 0), value => {
                    open.value = value;
                });
                return open;
            }
        };
        return obj;
    }
}

export function Sheets() {
    return new SheetsComponent().make();
}
