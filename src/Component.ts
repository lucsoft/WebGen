import { FontWeight, TextSize } from "../core/types.ts";
import { createElement } from "./Components.ts";
import { Refable, asRef, ref } from "./State.ts";

export type ContentDistribution = 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
export type ContentPosition = 'center' | 'start' | 'end' | 'flex-start' | 'flex-end';

export abstract class Component extends EventTarget {
    constructor(protected wrapper: HTMLElement = createElement("div")) {
        super();
    }

    addClass<stringy extends string | undefined>(val: Refable<stringy>, ...classes: string[]) {
        asRef(val).listen((newVal, oldVal) => {
            if (oldVal)
                this.wrapper.classList.remove(oldVal);
            if (newVal)
                this.wrapper.classList.add(newVal);
        });

        this.wrapper.classList.add(...classes);
        return this;
    }
    setCssStyle<stringy extends string>(key: keyof Omit<HTMLElement[ "style" ], 'length' | 'parentRule'>, value: Refable<stringy>) {
        asRef(value).listen((val) => {
            // deno-lint-ignore no-explicit-any
            this.wrapper.style[ key as any ] = val;
        });
        return this;
    }
    setViewTransitionName(name: Refable<string>) {
        this.setCssStyle("viewTransitionName" as "display", name);
        return this;
    }
    setAnchorName(name?: string) {
        if (name == undefined) {
            this.wrapper.removeAttribute("anchor");
            return this;
        }
        this.setAttribute("anchor", name);
        return this;
    }
    setAttribute(key: string, value: Refable<string | undefined> = "") {
        asRef(value).listen((val) => {
            if (val === undefined) {
                this.wrapper.removeAttribute(key);
                return;
            }
            this.wrapper.setAttribute(key, val);
        });
        return this;
    }
    setPadding(size: Refable<string>) {
        this.setCssStyle("padding", size);
        return this;
    }
    addPrefix(component: Component) {
        this.wrapper.prepend(component.draw());
        return this;
    }
    addSuffix(component: Component) {
        this.wrapper.append(component.draw());
        return this;
    }
    setWidth(size: Refable<string>) {
        this.setCssStyle("width", size);
        return this;
    }
    setMinWidth(size: Refable<string>) {
        this.setCssStyle("minWidth", size);
        return this;
    }
    setMaxWidth(size: Refable<string>) {
        this.setCssStyle("maxWidth", size);
        return this;
    }
    setHeight(size: Refable<string>) {
        this.setCssStyle("height", size);
        return this;
    }
    setMinHeight(size: Refable<string>) {
        this.setCssStyle("minHeight", size);
        return this;
    }
    setMaxHeight(size: Refable<string>) {
        this.setCssStyle("maxHeight", size);
        return this;
    }
    setMargin(size: Refable<string>) {
        this.setCssStyle("margin", size);
        return this;
    }
    setId(id: string) {
        this.wrapper.id = id;
        return this;
    }
    setGrow(value: Refable<number> = 1) {
        this.setCssStyle("flexGrow", asRef(value).map(it => it.toString()));
        return this;
    }
    setAlignItems(type: Refable<"center" | "end" | "start" | "stretch">) {
        this.setCssStyle("alignItems", type);
        return this;
    }
    setAlignContent(type: Refable<"normal" | ContentDistribution | ContentPosition>) {
        this.setCssStyle("alignContent", type);
        return this;
    }
    setAlignSelf(type: Refable<"center" | "end" | "start" | "stretch">) {
        this.setCssStyle("alignSelf", type);
        return this;
    }
    setJustifyItems(type: Refable<"center" | "end" | "start" | "stretch">) {
        this.setCssStyle("justifyItems", type);
        return this;
    }
    setJustifyContent(type: Refable<"normal" | ContentDistribution | ContentPosition>) {
        this.setCssStyle("justifyContent", type);
        return this;
    }
    setJustifySelf(type: Refable<"center" | "end" | "start" | "stretch">) {
        this.setCssStyle("justifySelf", type);
        return this;
    }
    setShadow(size: Refable<'0' | '1' | '2' | '3' | '4' | '5'>) {
        this.addClass(asRef(size).map(it => it === '0' ? undefined : `shadow-${it}`));
        return this;
    }
    setBorderRadius(value: Refable<"none" | "tiny" | "mid" | "large" | "complete" | string>) {
        const map = {
            "tiny": "0.3rem",
            "mid": "0.5rem",
            "large": "0.8rem",
            "complete": "100rem"
        };

        //@ts-ignore fail if bad input
        this.setCssStyle("borderRadius", asRef(value).map(it => map[ it ] ?? it));

        return this;
    }
    setTextSize(size: Refable<TextSize>) {
        this.addClass(ref`text-${size}`);
        return this;
    }
    setFontWeight(weight: Refable<FontWeight>) {
        this.addClass(ref`font-${weight}`);
        return this;
    }
    setDirection(type: Refable<"column" | "row" | "row-reverse" | "column-reverse">) {
        this.setCssStyle("flexDirection", type);
        return this;
    }
    setMixBlendMode(blendMode: Refable<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'>) {
        this.setCssStyle("mixBlendMode", blendMode);
        return this;
    }
    draw() {
        return this.wrapper;
    }
    onRightClick(func: (env: MouseEvent) => void) {
        this.wrapper.addEventListener('contextmenu', (e) => func(e));
        return this;
    }
    onClick(func: (ev: UIEvent) => void) {
        this.wrapper.addEventListener('click', func);
        this.wrapper.addEventListener('keydown', (me) => {
            if (me.key == 'Enter' || me.key == ' ') {
                func(me);
            }
        });
        return this;
    }
    removeFromLayout() {
        this.wrapper.style.display = "contents";
        return this;
    }
}
