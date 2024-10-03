import { Component } from "../core/components.ts";

export function appendBody(component: Component) {
    document.body.append(component.draw());
}