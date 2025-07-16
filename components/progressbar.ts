import {asWebGenComponent, HTMLComponent} from "../core/components.ts";
import {alwaysRef, Refable} from "../core/state.ts";
import {css} from "../core/cssTemplate.ts";
import {Color} from "../core/color.ts";
import {Label} from "../core/layout/label.ts";

@asWebGenComponent("progress-bar")
export class ProgressbarComponent extends HTMLComponent {
    #outer = document.createElement("div");
    #inner = document.createElement("div");
    value: Refable<number>;
    max: number;

    constructor(value: Refable<number>, max: number = 100, unit: string = "%") {
        super();
        this.max = max;
        this.value = value;
        let valueString = alwaysRef(this.value).map(v => v.toString() + unit);
        this.shadowRoot!.appendChild(this.#outer);
        this.style.height = 20 + "px";
        this.style.width = "100px";
        this.#inner.id = "inner";
        this.#outer.appendChild(this.#inner);
        this.shadowRoot!.appendChild(Label(valueString).draw());

        this.shadowRoot!.adoptedStyleSheets.push(css`
            div{
                height: ${this.style.height};
                width: ${this.style.width};
            }
        `)
        this.useListener(alwaysRef(this.value), value => {
            const inner = this.shadowRoot!.getElementById("inner");
            if (inner && value >= 0 && value <= max) {
                inner.style.width = (value / max * 100) + "%";
            }
        });
    };


    override make() {
        const obj = {
            ...super.make(),
            setWidth: (width: string) => {
                this.style.width = width;
                return obj;
            },
            setHeight: (height: string) => {
                this.style.height = height;
                return obj;
            },
            setBarColor: (color: Color) => {
                this.#inner.style.backgroundColor = color.toString();
                return obj;
            },
            setBackgroundColor: (color: Color) => {
                this.#outer.style.backgroundColor = color.toString();
                return obj;
            },
            setBorderRadius: (radius: string) => {
                this.#outer.style.borderRadius = radius;
                this.#inner.style.borderRadius = radius;
                return obj;
            }
        };
        return obj;
    }
}

export function Progressbar(value: Refable<number>, max: number = 100, unit: string = "%"): ProgressbarComponent {
    return new ProgressbarComponent(10, max, unit).make()
        .setWidth("200px")
        .setHeight("20px")
        .setBarColor(Color.primary)
        .setBackgroundColor(Color.neutral)
        .setBorderRadius("10px")
}
