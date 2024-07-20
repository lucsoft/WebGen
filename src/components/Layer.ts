import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import './Layer.css';

export type LayerLevels = 0 | 1 | 2 | 3 | 4 | 5;

class LayerComponent extends Component {
    level = 0;
    tintlayer = createElement("div");

    constructor(child: Component, level: LayerLevels = 0) {
        super();
        this.wrapper.append(child.draw());
        this.wrapper.classList.add("wlayer", "wlayer" + level);
        this.tintlayer.classList.add("wlayer-inner");
    }
}

export const Layer = (child: Component, level: LayerLevels = 0) => new LayerComponent(child, level);