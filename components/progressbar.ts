import {asWebGenComponent, HTMLComponent} from "../core/components.ts";
import {alwaysRef, Refable} from "../core/state.ts";
import {css} from "../core/cssTemplate.ts";
import {Color} from "../core/color.ts";
import {Label} from "../core/layout/label.ts";

@asWebGenComponent("progress-bar")
export class ProgressbarComponent extends HTMLComponent {
    #frame = document.createElement("div");
    #bar = document.createElement("div");
    progress: Refable<number>;
    max: number;

    constructor(progress: Refable<number>, max: number = 100, unit: string = "%") {
        super();
        this.max = max;
        this.progress = progress;
        let valueString = alwaysRef(this.progress).map(v => v.toString() + unit);

        this.shadowRoot!.appendChild(this.#frame);
        this.#bar.id = "inner";
        this.#frame.appendChild(this.#bar);
        this.shadowRoot!.appendChild(Label(valueString).draw());

        this.useListener(alwaysRef(this.progress), value => {
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
                this.#frame.style.width = width;
                this.#bar.style.width = width;
                return obj;
            },
            setHeight: (height: string) => {
                this.style.height = height;
                this.#frame.style.height = height;
                this.#bar.style.height = height;
                return obj;
            },
            setBarColor: (color: Color) => {
                this.#bar.style.backgroundColor = color.toString();
                return obj;
            },
            setBackgroundColor: (color: Color) => {
                this.#frame.style.backgroundColor = color.toString();
                return obj;
            },
            setBorderRadius: (radius: string) => {
                this.#frame.style.borderRadius = radius;
                this.#bar.style.borderRadius = radius;
                return obj;
            }
        };
        return obj;
    }
}

export function Progressbar(value: Refable<number>, max: number = 100, unit: string = "%"): ProgressbarComponent {
    return new ProgressbarComponent(value, max, unit).make()
        .setWidth("200px")
        .setHeight("20px")
        .setBarColor(Color.primary)
        .setBackgroundColor(Color.neutral)
        .setBorderRadius("10px")
}
