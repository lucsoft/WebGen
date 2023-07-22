import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
import { asPointer, Pointable } from "../../State.ts";
import { Component } from "../../types.ts";

export class BootstrapIconComponent extends Component {
    constructor(name: Pointable<string>) {
        super();
        this.addClass(asPointer(name).map(it => `bi-${it}`), "bi", "wicon");
    }
}

export const BootstrapIcon = (name: Pointable<string>) => new BootstrapIconComponent(name);
export const BIcon = BootstrapIcon;