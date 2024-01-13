import { Component } from "../Component.ts";
import { Pointable, asRef } from "../State.ts";
import { lazyInit } from "../lazyInit.ts";

const iconSet = {
    outlined: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-icons@1.13.8/iconfont/outlined.css")),
    filled: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-icons@1.13.8/iconfont/filled.css")),
    round: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-icons@1.13.8/iconfont/round.css")),
    sharp: lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-icons@1.13.8/iconfont/sharp.css")),
    "two-tone": lazyInit(() => import("https://cdn.jsdelivr.net/npm/material-icons@1.13.8/iconfont/two-tone.css")),
};
export class MaterialIconComponent extends Component {
    constructor(name: Pointable<string>, type: Pointable<"outlined" | "filled" | "round" | "sharp" | "two-tone">) {
        super();
        asRef(name).listen(val => this.wrapper.innerText = val);
        asRef(type).listen((val: keyof typeof iconSet) => iconSet[ val ]());
        this.addClass(asRef(type).map(it => it == "filled" ? "material-icons" : "material-icons-" + it), "wicon");
    }
}

export const MaterialIcon = (name: Pointable<string>, type: Pointable<"outlined" | "filled" | "round" | "sharp" | "two-tone"> = "round") => new MaterialIconComponent(name, type);
export const MIcon = MaterialIcon;