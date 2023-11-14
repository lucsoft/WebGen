import { Component } from "../Component.ts";
import './Scrollable.css';

export class ScrollableComponent extends Component {
    constructor(private readonly content: Component[]) {
        super();
        this.addClass("wscrollable");
        this.wrapper.append(...content.map(it => it.draw()));
    }
}

export const Scrollable = (...content: Component[]) => new ScrollableComponent(content);