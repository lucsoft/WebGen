import 'bootstrap-icons/font/bootstrap-icons.css';
import { Icons } from "./none";

export class BootstrapIcons extends Icons {
    constructor() {
        super();
        (globalThis as any).WEBGEN_ICON = "bootstrap";
    }
}