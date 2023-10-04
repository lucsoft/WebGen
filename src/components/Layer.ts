import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { Custom } from "./Custom.ts";
import './Layer.css';

export type LayerLevels = 0 | 1 | 2 | 3 | 4 | 5;
export type LayerSurface = "tint" | "shadow" | "tint-shadow";

class LayerComponent extends Component {
    level = 0;
    tintlayer = createElement("div");

    constructor(child: Component, level: LayerLevels = 0, surface: LayerSurface = "shadow") {
        super();
        this.wrapper.append(this.tintlayer, child.draw());
        this.wrapper.classList.add("wlayer", "wlayer" + level, surface);
        this.tintlayer.classList.add("wlayer-inner");
    }

    setBorderRadius(value: "none" | "tiny" | "mid" | "large" | "complete"): this {
        super.setBorderRadius(value);
        Custom(this.tintlayer).setBorderRadius(value);
        return this;
    }
}

export const Layer = (child: Component, level: LayerLevels = 0, surface: LayerSurface = "shadow") => new LayerComponent(child, level, surface);