
import { alwaysRef, asRef, asRefArray, listen, Refable, Reference } from "./state.ts";

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
    private textSize = asRef(asRef("") as Reference<string>);
    private cssClassList = asRefArray<string>([]);

    #addWatch(obj: () => { unlisten: () => void; }) {
        let unlisten = () => { };
        this.#listener.add({
            listen: () => {
                unlisten = obj().unlisten;
            },
            unlisten: () => {
                unlisten();
            }
        });
    }
    protected useListener<T>(ref: Reference<T>, callback: (newValue: T, oldValue?: T) => void) {
        this.#addWatch(() => ref.listen(callback));
    }
    protected addListen(obj: () => void) {
        this.#addWatch(() => listen(obj));
    }
    protected connectedCallback() {
        this.#listener.forEach(listener => listener.listen());
    }
    protected disconnectedCallback() {
        this.#listener.forEach(listener => listener.unlisten());
    }
    constructor() {
        super();
        this.addListen(() => this.style.fontSize = this.textSize.value.value);
        this.useListener(this.cssClassList, (newList, oldList) => {
            const deletedItems = (oldList ?? []).filter(it => !newList.includes(it));
            const addedItems = (newList ?? []).filter(it => !(oldList ?? []).includes(it));
            this.classList.remove(...deletedItems);
            this.classList.add(...addedItems);
        });
    }
    make() {
        const obj = {
            draw: () => this,
            setTextSize: (value: Refable<string> | string) => { this.textSize.value = alwaysRef(value); return obj; },
            addClass: <stringy extends string | undefined>(classToken: Refable<stringy>, ...classes: string[]) => {
                this.classList.add(...classes);
                const token = alwaysRef(classToken);
                this.useListener(token, (newValue, oldValue) => {
                    console.log(newValue, oldValue);
                    if (oldValue !== undefined && oldValue !== newValue)
                        this.cssClassList.removeItem(oldValue);
                    if (newValue !== undefined)
                        this.cssClassList.addItem(newValue);
                });
                return obj;
            }
        };
        return obj;
    }
}
