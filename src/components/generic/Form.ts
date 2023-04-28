import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";

export const Form = (ele: Component) => new class extends Component {
    wrapper = createElement("form");

    constructor() {
        super();
        this.wrapper.append(ele.draw());
    }

    activeSubmitTo(selector: string) {
        const submit = createElement("input");
        submit.type = "submit";
        submit.hidden = true;
        submit.onclick = (e) => {
            e.preventDefault();
            if (!this.wrapper.reportValidity()) return;

            this.wrapper.querySelector<HTMLElement>(selector)?.click();
        };
        this.wrapper.append(submit);
        return this;
    }
};