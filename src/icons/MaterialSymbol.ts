import { Component } from "../Component.ts";
import { Pointable, asPointer } from "../State.ts";
import { lazyInit } from "../lazyInit.ts";

const iconSet = {
    outlined: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.10.0/outlined.css")),
    rounded: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.10.0/rounded.css")),
    sharp: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-symbols@0.10.0/sharp.css")),
};
export class MaterialSymbolComponent extends Component {
    constructor(name: Pointable<string>, type: Pointable<"outlined" | "rounded" | "sharp">) {
        super();
        asPointer(name).listen(val => this.wrapper.innerText = val);
        asPointer(type).listen((val: keyof typeof iconSet) => iconSet[ val ]());
        this.addClass(asPointer(type).map(it => "material-symbols-" + it), "wicon");
    }
}

export const MaterialSymbol = (name: Pointable<string>, type: Pointable<"outlined" | "rounded" | "sharp">) => new MaterialSymbolComponent(name, type);
export const MSymbol = MaterialSymbol;