import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { Custom } from "./Custom.ts";

export function Box(...components: Component[]) {
    const block = createElement("div");
    block.append(...components.map(x => x.draw()));
    return Custom(block);
}
