
import { FontWeight, TextSize } from "../src/types.ts";
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
    private textSize = asRef(undefined) as Reference<TextSize | undefined>;
    private fontWeight = asRef(undefined) as Reference<FontWeight | undefined>;
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
    protected addListen<T>(obj: (oldValue?: T) => T) {
        let oldValue: T | undefined = undefined;
        this.#addWatch(() => listen(() => {
            oldValue = obj(oldValue);
        }));
    }
    protected connectedCallback() {
        this.#listener.forEach(listener => listener.listen());
    }
    protected disconnectedCallback() {
        this.#listener.forEach(listener => listener.unlisten());
    }
    constructor() {
        super();
        this.addListen((oldVal) => {
            const newValue = this.textSize.value;
            if (oldVal === newValue) return;
            this.classList.remove(`text-${oldVal}`);
            this.classList.add(`text-${newValue}`);
            return this.textSize.value;
        });
        this.addListen((oldVal) => {
            const newValue = this.fontWeight.value;
            if (oldVal === newValue) return;
            this.classList.remove(`font-${oldVal}`);
            this.classList.add(`font-${newValue}`);
            return this.fontWeight.value;
        });
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
            setTextSize: (value: Refable<TextSize>) => { this.textSize = alwaysRef(value); return obj; },
            setFontWeight: (value: Refable<FontWeight>) => { this.fontWeight = alwaysRef(value); return obj; },
            addClass: <stringy extends string | undefined>(classToken: Refable<stringy>, ...classes: string[]) => {
                this.classList.add(...classes);
                const token = alwaysRef(classToken);
                this.useListener(token, (newValue, oldValue) => {
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
