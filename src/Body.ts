import { Component } from "./Component.ts";
import { createElement } from "./Components.ts";
import { Custom } from "./components/Custom.ts";

export const Body = (component: Component) => {
    const item = createElement('article');
    item.append(component.draw());
    document.body.append(item);
    return Custom(item);
};