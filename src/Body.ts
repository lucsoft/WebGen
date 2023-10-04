import { Component } from "./Component.ts";
import { Custom, createElement } from "./webgen.ts";

export const Body = (component: Component) => {
    const item = createElement('article');
    item.append(component.draw());
    document.body.append(item);
    return Custom(item);
};