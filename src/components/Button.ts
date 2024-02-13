import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../Accessibility.ts";
import { Color } from "../Color.ts";
import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { Refable, asRef, isRef } from "../State.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import './Button.css';
import { loadingWheel } from "./light-components/loadingWheel.ts";

const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];
const enableTuple = (enabled: boolean, color = Color.Grayscaled) => [ Color.Disabled, color ][ enabled ? "values" : "reverse" ]() as [ Color, Color ];

export class ButtonComponent extends ColoredComponent {
    prog = createElement("div");
    style = asRef(ButtonStyle.Normal);

    constructor(string: Refable<string | Component>, wrapper: HTMLElement = createElement("button")) {
        super(wrapper);
        this.color.listen((val) => {
            this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(val);
        });

        this.addClass(this.color);
        this.wrapper.classList.add("wbutton", ButtonStyle.Normal);
        this.wrapper.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        this.wrapper.append(loadingWheel());
        this.wrapper.onkeydown = accessibilityButton(this.wrapper);
        if (isRef(string))
            string.listen((val) => {
                Array.from(this.wrapper.childNodes).at(-1)?.remove();
                this.wrapper.append(typeof val == "string" ? val : val.draw());
            });
        else
            this.wrapper.append(typeof string == "string" ? string : string.draw());
        this.color.listen(color => {
            // this.setEnabled = (enabled: boolean) => this.wrapper.classList.replace(...enableTuple(enabled, color));
            this.wrapper.tabIndex = speicalSyles.includes(this.wrapper.classList[ 3 ] as ButtonStyle) ? -1 : accessibilityDisableTabOnDisabled(color);
        });
        this.addClass(this.style);
        this.addClass(this.style.map(it => it == ButtonStyle.Spinner ? "loading" : "non-loading"));
    }
    setEnabled = (enabled: boolean) => this.wrapper.classList.replace(...enableTuple(enabled));
    setStyle(style: Refable<ButtonStyle>, progress?: Refable<number>) {
        if (isRef(style)) {
            style.listen((val) => this.setStyle(val));
            return this;
        }
        this.wrapper.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
        this.style.setValue(style);
        if (progress !== undefined && style === ButtonStyle.Progress) {
            this.prog.classList.add("progress");
            asRef(progress).listen(progress => {
                this.prog.style.width = `${progress.toString()}%`;
            });
            this.wrapper.append(this.prog);
        }
        return this;
    }
    setAlignContent(type: "center" | "end" | "start" | "stretch") {
        this.wrapper.style.alignContent = type;
        return this;
    }
    setJustifyContent(type: "center" | "end" | "start" | "stretch") {
        this.wrapper.style.justifyContent = type;
        return this;
    }
    setGrow(value = 1) {
        this.wrapper.style.flexGrow = value.toString();
        return this;
    }
    onPromiseClick(func: (env: MouseEvent, e: ButtonComponent) => Promise<void>) {
        this.onClick(async (env, e) => {
            const styleBefore = this.style.getValue();
            this.setStyle(ButtonStyle.Spinner);
            try {
                await func(env, e);
            } catch (error) {
                console.error(error);
            }
            this.setStyle(styleBefore);
        });
        return this;
    }
    onClick(func: (env: MouseEvent, e: ButtonComponent) => void) {
        if (this.color.getValue() == Color.Disabled) return this;
        this.wrapper.addEventListener('click', (e) => func(e, this));
        return this;
    }
}
export class LinkButtonComponent extends ButtonComponent {
    constructor(title: Refable<string | Component>, url: string, target?: string) {
        super(title, createElement("a"));
        if (this.wrapper instanceof HTMLAnchorElement) {
            this.wrapper.href = url;
            if (target)
                this.wrapper.target = target;
        }
    }
}


export const Button = (string: Refable<string | Component>) => new ButtonComponent(string);
export const LinkButton = (string: Refable<string | Component>, url: string, target?: string) => new LinkButtonComponent(string, url, target);