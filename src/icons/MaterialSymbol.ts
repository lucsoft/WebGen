import { Component } from "../Component.ts";
import { Refable, asRef } from "../State.ts";
import { lazyInit } from "../lazyInit.ts";

const iconSet = {
    outlined: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.14.5/outlined.css")),
    rounded: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.14.5/rounded.css")),
    sharp: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.14.5/sharp.css")),
};
export class MaterialSymbolComponent extends Component {
    constructor(name: Refable<string>, type: Refable<"outlined" | "rounded" | "sharp">) {
        super();
        asRef(name).listen(val => this.wrapper.innerText = val);
        asRef(type).listen((val: keyof typeof iconSet) => iconSet[ val ]());
        this.addClass(asRef(type).map(it => `material-symbols-${it}`), "wicon");
    }
}

export const MaterialSymbol = (name: Refable<string>, type: Refable<"outlined" | "rounded" | "sharp">) => new MaterialSymbolComponent(name, type);
export const MSymbol = MaterialSymbol;