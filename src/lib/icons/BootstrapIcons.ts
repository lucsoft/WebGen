import { WebGenGlobalThis } from "../../types.ts";
import { Icons } from "./none.ts";
import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css';

export class BootstrapIcons extends Icons {
    constructor() {
        super();
        (globalThis as WebGenGlobalThis).WEBGEN_ICON = "bootstrap";
    }
}