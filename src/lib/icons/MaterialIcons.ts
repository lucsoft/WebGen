import 'material-icons/iconfont/round.css';
import { Icons } from "./none";

export class MaterialIcons extends Icons {
    constructor() {
        super();
        (globalThis as any).WEBGEN_ICON = "material";
    }
}