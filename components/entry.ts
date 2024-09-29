import { asRef, asWebGenComponent, Box, Color, Component, css, Grid, HTMLComponent, listen } from "../core/mod.ts";
import { MaterialIcon } from "./icons.ts";
import { Spinner } from "./spinner.ts";

@asWebGenComponent("entry")
export class EntryComponent extends HTMLComponent {
    #button = document.createElement("button");
    #loading = asRef(false);
    #canClick = asRef(false);
    constructor(content: Component) {
        super();
        this.#button.append(Grid(
            content,
            Box(this.#canClick.map(canClick => canClick ? Box(this.#loading.map(loading => loading ? Spinner() : MaterialIcon("arrow_forward_ios"))) : []))
        )
            .setTemplateColumns("auto")
            .setAutoFlow("column")
            .setAutoColumn("max-content")
            .setAlignItems("center")
            .setWidth("100%")
            .draw());
        this.shadowRoot!.append(this.#button);

        this.addWatch(() => listen(() => {
            this.#button.disabled = !this.#canClick.value || this.#loading.value;
        }));

        this.shadowRoot!.adoptedStyleSheets.push(css`
            :host {
                display: grid
            }
            button {
                all: unset;
                display: grid;
                background-color: ${Color.reverseNeutral.mix(Color.primary, 5)};
                place-items: center start;
                box-sizing: border-box;
                padding: 0 25px;
                transition: all 250ms ease;
                cursor: pointer;
                box-shadow: var(--wg-shadow-1);
                border-radius: var(--wg-entry-radius, var(--wg-radius-large));
                margin: 5px 0;
                outline: none;
            }
            button:not(:disabled):focus-visible,
            button:not(:disabled):hover {
                background-color: ${Color.reverseNeutral.mix(Color.primary, 12)};
                box-shadow: var(--wg-shadow-4);
                transform: translate(0, -2px);
            }
            button:not(:disabled):active {
                transform: translate(0, 0);
                box-shadow: var(--wg-shadow-3);
            }
        `);
    }

    make() {
        const obj = {
            ...super.make(),
            addPrefix: (component: Component) => { this.#button.prepend(component.draw()); return obj; },
            addSuffix: (component: Component) => { this.#button.append(component.draw()); return obj; },
            onClick: (callback: () => void) => {
                this.#canClick.value = true;
                super.make().onClick(callback);
                return obj;
            },
            onPromiseClick: (callback: () => Promise<void>) => {
                this.#canClick.value = true;

                super.make().onClick(() => {
                    if (this.#loading.value) return;
                    this.#loading.value = true;
                    callback()
                        .catch(() => { })
                        .finally(() => {
                            this.#loading.value = false;
                        });
                });

                return obj;
            }
        };
        return obj;
    }
}

export function Entry(content: Component) {
    return new EntryComponent(content).make();
}
