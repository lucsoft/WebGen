import './Label.css';

import { Component } from '../Component.ts';
import { createElement } from '../Components.ts';
import { asRef, Refable } from '../State.ts';

export const Label = (title: Refable<string>, type: `h${1 | 2 | 3 | 4 | 5 | 6}` | `span` = "span") => new class extends Component {
    wrapper = createElement(type);
    constructor() {
        super();
        this.addClass("wlabel");
        asRef(title).listen((val) => this.wrapper.textContent = val);
    }

    setTextAlign(type: "center" | "end" | "start") {
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