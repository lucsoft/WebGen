import { alwaysRef, asRefArray, listen, ref, Refable, Reference } from "./state.ts";
import { FontWeight, Radius, TextSize } from "./types.ts";

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

export type ContentDistribution = 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
export type ContentPosition = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end';

export class HTMLComponent extends HTMLElement {
    #listener = new Set<{ listen: () => void, unlisten: () => void; }>();
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

            // Layout Additions
            addPrefix: (component: Component) => { this.prepend(component.draw()); return obj; },
            addSuffix: (component: Component) => { this.append(component.draw()); return obj; },

            // Common HTML
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
            },
            setAttribute: (key: string, value: Refable<string | undefined>) => {
                this.useListener(alwaysRef(value), (newValue, oldValue) => {
                    if (oldValue !== undefined)
                        this.removeAttribute(key);
                    if (newValue !== undefined)
                        this.setAttribute(key, newValue);
                });
                return obj;
            },
            setCssStyle: <stringfy extends string>(key: keyof Omit<HTMLElement[ "style" ], "length" | "parentRule">, value: Refable<stringfy>) => {
                this.useListener(alwaysRef(value), (newValue) => {
                    // deno-lint-ignore no-explicit-any
                    this.style[ key as any ] = newValue;
                });
                return obj;
            },
            setAnchorName: (name: Refable<string | undefined>) => {
                obj.setAttribute("anchor", name);
                return obj;
            },
            setViewTransitionName: (name: Refable<string>) => {
                // deno-lint-ignore no-explicit-any
                obj.setCssStyle("viewTransitionName" as any, name);
                return obj;
            },
            setPadding: (size: Refable<string>) => {
                obj.setCssStyle("padding", size);
                return obj;
            },
            setWidth: (size: Refable<string>) => {
                obj.setCssStyle("width", size);
                return obj;
            },
            setMinWidth: (size: Refable<string>) => {
                obj.setCssStyle("minWidth", size);
                return obj;
            },
            setMaxWidth: (size: Refable<string>) => {
                obj.setCssStyle("maxWidth", size);
                return obj;
            },
            setHeight: (size: Refable<string>) => {
                obj.setCssStyle("height", size);
                return obj;
            },
            setMinHeight: (size: Refable<string>) => {
                obj.setCssStyle("minHeight", size);
                return obj;
            },
            setMaxHeight: (size: Refable<string>) => {
                obj.setCssStyle("maxHeight", size);
                return obj;
            },
            setMargin: (size: Refable<string>) => {
                obj.setCssStyle("margin", size);
                return obj;
            },
            setId: (id: Refable<string>) => {
                obj.setAttribute("id", id);
                return obj;
            },
            setGrow: (value: Refable<number> = 1) => {
                obj.setCssStyle("flexGrow", alwaysRef(value).map(it => it.toString()));
                return obj;
            },
            setAlignItems: (value: Refable<"center" | "end" | "start" | "stretch">) => {
                obj.setCssStyle("alignItems", value);
                return obj;
            },
            setAlignContent: (value: Refable<"normal" | ContentDistribution | ContentPosition>) => {
                obj.setCssStyle("alignContent", value);
                return obj;
            },
            setAlignSelf: (value: Refable<"center" | "end" | "start" | "stretch">) => {
                obj.setCssStyle("alignSelf", value);
                return obj;
            },
            setJustifyItems: (value: Refable<"center" | "end" | "start" | "stretch">) => {
                obj.setCssStyle("justifyItems", value);
                return obj;
            },
            setJustifyContent: (value: Refable<"normal" | ContentDistribution | ContentPosition>) => {
                obj.setCssStyle("justifyContent", value);
                return obj;
            },
            setJustifySelf: (value: Refable<"center" | "end" | "start" | "stretch">) => {
                obj.setCssStyle("justifySelf", value);
                return obj;
            },
            setMixBlendMode: (value: Refable<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'>) => {
                obj.setCssStyle("mixBlendMode", value);
                return obj;
            },
            setDirection: (value: Refable<"column" | "row" | "row-reverse" | "column-reverse">) => {
                obj.setCssStyle("flexDirection", value);
                return obj;
            },

            // Specialized
            setShadow: (value: Refable<'0' | '1' | '2' | '3' | '4' | '5'>) => {
                obj.addClass(alwaysRef(value).map(it => it === '0' ? undefined : `shadow-${it}`));
            },
            setTextSize: (value: Refable<TextSize>) => {
                obj.addClass(ref`text-${value}`);
                return obj;
            },
            setFontWeight: (value: Refable<FontWeight>) => {
                obj.addClass(ref`font-${value}`);
                return obj;
            },
            setRadius: (value: Refable<Radius>) => {
                obj.addClass(ref`radius-${value}`);
                return obj;
            },

            // Events
            onClick: (action: () => void) => {
                this.#listener.add({
                    listen: () => this.addEventListener("click", action),
                    unlisten: () => this.removeEventListener("click", action)
                });
                return obj;
            },
            onRightClick: (action: () => void) => {
                this.#listener.add({
                    listen: () => this.addEventListener("contextmenu", action),
                    unlisten: () => this.removeEventListener("contextmenu", action)
                });
                return obj;
            }
        };
        return obj;
    }
}
