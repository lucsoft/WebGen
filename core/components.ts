import { alwaysRef, asRef, listen, Refable, Reference } from "./state.ts";

// deno-lint-ignore prefer-const
export let WEBGEN_PREFIX = "wg-";

export interface Component {
    draw: () => HTMLElement;
}

export function asWebGenComponent(value: string) {
    return (target: CustomElementConstructor) => {
        customElements.define(WEBGEN_PREFIX + value, target);
    };
}


export class HTMLComponent extends HTMLElement {
    #listener = new Set<{ listen: () => void, unlisten: () => void; }>();
    textSize = asRef(asRef("") as Reference<string>);
    protected watch(obj: () => void) {
        let unlisten = () => { };
        this.#listener.add({
            listen: () => {
                unlisten = listen(obj).unlisten;
            },
            unlisten: () => {
                unlisten();
            }
        });
    }
    protected connectedCallback() {
        this.#listener.forEach(listener => listener.listen());
    }
    protected disconnectedCallback() {
        this.#listener.forEach(listener => listener.unlisten());
    }
    constructor() {
        super();
        this.watch(() => {
            this.style.fontSize = this.textSize.value.value;
        });
    }
    make() {
        const obj = {
            draw: () => this,
            setTextSize: (value: Refable<string> | string) => { this.textSize.value = alwaysRef(value); return obj; }
        };
        return obj;
    }
}
