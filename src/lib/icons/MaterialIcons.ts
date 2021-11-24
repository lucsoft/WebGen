import { WebGenGlobalThis } from "../../types.ts";
import { Icons } from "./none.ts";
import 'https://cdn.jsdelivr.net/npm/material-icons@1.10.3/iconfont/round.css';

export class MaterialIcons extends Icons {
    constructor() {
        super();
        (globalThis as WebGenGlobalThis).WEBGEN_ICON = "material";
    }
}