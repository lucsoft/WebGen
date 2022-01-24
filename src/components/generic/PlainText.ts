import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";

export const PlainText = (title: string, type: `h${1 | 2 | 3 | 4 | 5 | 6}` | `span` = "span") => new class extends Component {
    wrapper = createElement(type);
    constructor() {
        super()
        this.wrapper.innerText = title;
    }
    setFont(size: number, weight = 100) {
        this.wrapper.style.fontSize = size + "rem";
        this.wrapper.style.fontWeight = weight.toString();
        return this;
    }
}