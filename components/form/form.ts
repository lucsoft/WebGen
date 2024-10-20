import { asWebGenComponent, Component, HTMLComponent } from "../../core/mod.ts";

@asWebGenComponent("form")
export class FormComponent extends HTMLComponent {
    #form = document.createElement("form");
    constructor(components: Component) {
        super();

        this.shadowRoot?.append(this.#form);
        this.#form.append(components.draw());
    }
}