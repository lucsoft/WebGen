import {asWebGenComponent, HTMLComponent} from "../core/components.ts";
import {alwaysRef, Refable} from "../core/state.ts";
import {css} from "../core/cssTemplate.ts";

@asWebGenComponent("progress-bar")
export class ProgressbarComponent extends HTMLComponent {
    constructor(value: Refable<number>) {
        super();
        this.shadowRoot!.innerHTML = `
        <div id="outer">
        <div id="inner"></div></div>
        `;
        this.shadowRoot!.adoptedStyleSheets.push(css`
            div{
                height: 100px;
                background-color: aqua;
            }
            #inner {
                background-color: green;
            }
        `)
        this.useListener(alwaysRef(value), value => {
            const inner = this.shadowRoot!.getElementById("inner");
            if (inner) {
                inner.style.width = value + "%";
            }
        });
    }
}

export function Progressbar(value: Refable<number>) {
    return new ProgressbarComponent(value).make().setWidth("200px").setHeight("20px");
}
