import { Color } from "../../lib/Color.ts";
import { ColoredComponent, ButtonStyle, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import '../../css/buttons.webgen.static.css';
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { changeClassAtIndex } from "../Helper.ts";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { Pointable, isPointer } from "../../State.ts";

const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];
const enableTuple = (enabled: boolean, color = Color.Grayscaled) => [ Color.Disabled, color ][ enabled ? "values" : "reverse" ]() as [ Color, Color ];

export class ButtonComponent extends ColoredComponent {
    prog = createElement("div");
    constructor(string: Pointable<string | Component>) {
        super();
        this.wrapper.classList.add("wbutton", Color.Grayscaled, ButtonStyle.Normal);
        this.wrapper.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        this.wrapper.append(loadingWheel());
        this.wrapper.onkeydown = accessibilityButton(this.wrapper);
        if (isPointer(string))
            string.on((val) => {
                Array.from(this.wrapper.childNodes).at(-1)?.remove();
                this.wrapper.append(typeof val == "string" ? val : val.draw());
            });
        else
            this.wrapper.append(typeof string == "string" ? string : string.draw());
    }
    setEnabled = (enabled: boolean) => this.wrapper.classList.replace(...enableTuple(enabled));
    setStyle(style: Pointable<ButtonStyle>, progress?: number) {
        if (isPointer(style)) {
            style.on((val) => this.setStyle(val));
            return this;
        }
        this.wrapper.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
        changeClassAtIndex(this.wrapper, style, 2);
        if (style === ButtonStyle.Spinner) {
            this.wrapper.classList.add("loading");
        } else this.wrapper.classList.remove("loading");

        if (progress !== undefined && style === ButtonStyle.Progress) {
            this.prog.classList.add("progress");
            this.prog.style.width = `${progress.toString()}%`;
            this.wrapper.append(this.prog);
        }
        return this;
    }
    setAlign(type: "center" | "end" | "start" | "stretch") {
        this.wrapper.style.alignContent = type;
        return this;
    }
    setJustify(type: "center" | "end" | "start" | "stretch") {
        this.wrapper.style.justifyContent = type;
        return this;
    }
    asLinkButton(url: string, target?: string) {
        this.wrapper.href = url;
        if (target)
            this.wrapper.target = target;
        return this;
    }
    setGrow(value = 1) {
        this.wrapper.style.flexGrow = value.toString();
        return this;
    }
    onPromiseClick(func: (env: MouseEvent, e: ButtonComponent) => Promise<void>) {
        this.onClick(async (env, e) => {
            const cssclass = this.wrapper.classList.item(2);
            this.setStyle(ButtonStyle.Spinner);
            await func(env, e);
            this.setStyle(cssclass as ButtonStyle);
        });
        return this;
    }
    onClick(func: (env: MouseEvent, e: ButtonComponent) => void) {
        if (this.wrapper.classList.contains(Color.Disabled)) return this;
        this.wrapper.addEventListener('click', (e) => func(e, this));
        return this;
    }
    setColor(color: Pointable<Color>) {
        if (isPointer(color)) {
            color.on((val) => this.setColor(val));
            return this;
        }
        this.setEnabled = (enabled: boolean) => this.wrapper.classList.replace(...enableTuple(enabled, color));
        this.wrapper.tabIndex = speicalSyles.includes(this.wrapper.classList[ 3 ] as ButtonStyle) ? -1 : accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        return this;
    }
}
export const Button = (string: Pointable<string | Component>) => new ButtonComponent(string);