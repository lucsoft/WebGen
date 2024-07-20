import { Component } from "../Component.ts";
import { Refable, asRef } from "../State.ts";
import { lazy } from "../lazy.ts";

const iconSet = {
    outlined: lazy(() => import("https://esm.sh/material-icons@1.13.12/iconfont/outlined.css")),
    filled: lazy(() => import("https://esm.sh/material-icons@1.13.12/iconfont/filled.css")),
    round: lazy(() => import("https://esm.sh/material-icons@1.13.12/iconfont/round.css")),
    sharp: lazy(() => import("https://esm.sh/material-icons@1.13.12/iconfont/sharp.css")),
    "two-tone": lazy(() => import("https://esm.sh/material-icons@1.13.12/iconfont/two-tone.css")),
};
export class MaterialIconComponent extends Component {
    constructor(name: Refable<string>, type: Refable<"outlined" | "filled" | "round" | "sharp" | "two-tone">) {
        super();
        asRef(name).listen(val => this.wrapper.innerText = val);
        asRef(type).listen((val: keyof typeof iconSet) => iconSet[ val ]());
        this.addClass(asRef(type).map(it => it == "filled" ? "material-icons" : "material-icons-" + it), "wicon");
    }
}

export const MaterialIcon = (name: Refable<string>, type: Refable<"outlined" | "filled" | "round" | "sharp" | "two-tone"> = "round") => new MaterialIconComponent(name, type);
export const MIcon = MaterialIcon;