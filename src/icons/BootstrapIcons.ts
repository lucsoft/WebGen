import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';
import { Component } from "../Component.ts";
import { asRef, Refable } from "../State.ts";

export class BootstrapIconComponent extends Component {
    constructor(name: Refable<string>) {
        super();
        this.addClass(asRef(name).map(it => `bi-${it}`), "bi", "wicon");
    }
}

export const BootstrapIcon = (name: Refable<string>) => new BootstrapIconComponent(name);
export const BIcon = BootstrapIcon;