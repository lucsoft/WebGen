import { isPointer, Pointable } from "../../State.ts";
import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";
export const Label = (title: Pointable<string>, type: `h${1 | 2 | 3 | 4 | 5 | 6}` | `span` = "span") => new class extends Component {
    wrapper = createElement(type);
    constructor() {
        super();
        if (isPointer(title))
            title.listen((val) => this.wrapper.textContent = val);
        else
            this.wrapper.textContent = title;
    }
    setFont(size: number, weight = 100) {
        this.wrapper.style.fontSize = `${size}rem`;
        this.wrapper.style.fontWeight = weight.toString();
        return this;
    }
    setAlign(type: "center" | "end" | "start") {
        this.wrapper.style.textAlign = type;
        return this;
    }
};
/**
 * @deprecated Please use `Label` instead.
 * */
export const PlainText = Label;