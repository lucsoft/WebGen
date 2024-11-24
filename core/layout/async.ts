import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { Slot } from "./slot.ts";

@asWebGenComponent("async")
export class AsyncComponent extends HTMLComponent {

    constructor(source: Promise<Component>, fallback: Component) {
        super();
        this.shadowRoot?.append(Slot().draw());
        this.append(fallback.draw());
        source.then(component => {
            this.replaceChildren(component.draw());
        });
        source.catch(component => {
            this.replaceChildren(component.draw());
        });
    }
}

export function Async(source: Promise<Component>, fallback: Component) {
    return new AsyncComponent(source, fallback).make();
}