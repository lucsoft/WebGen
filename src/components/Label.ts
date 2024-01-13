import './Label.css';

import { Component } from '../Component.ts';
import { createElement } from '../Components.ts';
import { isRef, Pointable } from '../State.ts';

export const Label = (title: Pointable<string>, type: `h${1 | 2 | 3 | 4 | 5 | 6}` | `span` = "span") => new class extends Component {
    wrapper = createElement(type);
    constructor() {
        super();
        this.addClass("wlabel");
        if (isRef(title))
            title.listen((val) => this.wrapper.textContent = val);
        else
            this.wrapper.textContent = title;
    }

    setAlign(type: "center" | "end" | "start") {
        this.wrapper.style.textAlign = type;
        return this;
    }

    setBalanced() {
        if ('textWrap' in this.wrapper.style)
            this.wrapper.style.textWrap = "balance";
        return this;
    }

    removeWrap() {
        this.wrapper.style.whiteSpace = "nowrap";
        return this;
    }
};