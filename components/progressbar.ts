import {asWebGenComponent, HTMLComponent} from "../core/components.ts";
import {alwaysRef, Refable} from "../core/state.ts";
import {css} from "../core/cssTemplate.ts";
import {Color} from "../core/color.ts";
import {Label} from "../core/layout/label.ts";

@asWebGenComponent("progress-bar")
export class ProgressbarComponent extends HTMLComponent {
    #outer = document.createElement("div");
    #inner = document.createElement("div");

    constructor(value: Refable<number>) {
        super();
        let valueString = alwaysRef(value).map(v => v.toString());
        this.shadowRoot!.appendChild(this.#outer);
        this.style.height = 20 + "px";
        this.style.width = "100px";
        this.#inner.id = "inner";
        this.#outer.appendChild(this.#inner);
        this.shadowRoot!.appendChild(Label(valueString).draw());

        this.shadowRoot!.adoptedStyleSheets.push(css`
            :host {
                border-radius: 20px;
            }
            div{
                border-radius: 10px;
                height: ${this.style.height};
                width: ${this.style.width};
                background-color: ${Color.neutral.toString()};
            }
            #inner{
                background-color: ${Color.primary.toString()};
            }
        `)
        this.useListener(alwaysRef(value), value => {
            const inner = this.shadowRoot!.getElementById("inner");
            if (inner && value >= 0 && value <= 100) {
                inner.style.width = (value) + "%";
            }
        });
    }
}

export function Progressbar(value: Refable<number>): ProgressbarComponent {
    return new ProgressbarComponent(value).make().setWidth("200px").setHeight("20px");
}
