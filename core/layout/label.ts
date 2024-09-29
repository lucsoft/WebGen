import { asWebGenComponent, HTMLComponent } from "../components.ts";
import { alwaysRef, Refable } from "../state.ts";

@asWebGenComponent("label")
export class LabelComponent extends HTMLComponent {
    constructor(label: Refable<string>) {
        super();
        this.useListener(alwaysRef(label), label => this.shadowRoot!.textContent = label);
    }
}

export function Label(label: Refable<string>) {
    return new LabelComponent(label).make();
}