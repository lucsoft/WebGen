import { asRef, asWebGenComponent, Box, css, HTMLComponent } from "../core/mod.ts";
import { Spinner } from "./spinner.ts";

@asWebGenComponent("image")
export class ImageComponent extends HTMLComponent {
    loaded = asRef(false);
    constructor(source: string, alt: string) {
        super();
        const image = document.createElement("img");

        image.src = source;
        image.alt = alt;

        this.useEventListener(image, "load", () => {
            this.loaded.value = true;
            image.setAttribute("loaded", "");
        });
        const spinner = Spinner().setCssStyle("placeSelf", "center");
        this.shadowRoot!.append(Box(
            this.loaded.map(loaded => loaded ? [] : spinner),
            { draw: () => image }
        ).addClass("box").draw());


        this.shadowRoot!.adoptedStyleSheets.push(css`
            :host {
                overflow: hidden;
            }
            .box {
                display: grid;
            }
            .box > * {
                grid-row: 1;
                grid-column: 1;
            }
            img {
                opacity: 0;
                width: 100%;
            }
            img[loaded] {
                opacity: 1;
            }
        `);

    }
}

export function Image(source: string, alt: string) {
    return new ImageComponent(source, alt).make();
}