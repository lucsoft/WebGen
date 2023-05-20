import { Pointable, isPointer } from "../../State.ts";
import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";

export const PlainText = (title: Pointable<string>, type: `h${1 | 2 | 3 | 4 | 5 | 6}` | `span` = "span") => new class extends Component {
    wrapper = createElement(type);
    constructor() {
        super();
        if (isPointer(title))
            title.on((val) => this.wrapper.innerText = val);
        else
            this.wrapper.innerText = title;
    }
    setFont(size: number, weight = 100) {
        this.wrapper.style.fontSize = `${size}rem`;
        this.wrapper.style.fontWeight = weight.toString();
        return this;
    }
};