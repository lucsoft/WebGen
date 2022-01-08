import { Color } from "../../lib/Color.ts";
import { ColoredComponent, ButtonStyle } from "../../types.ts";
import { createElement } from "../Components.ts";
import '../../css/buttons.webgen.static.css';
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { changeClassAtIndex } from "../Helper.ts";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];
const enableTuple = (enabled: boolean, color = Color.Grayscaled) => [ Color.Disabled, color ][ enabled ? "values" : "reverse" ]() as [ Color, Color ];
class ButtonComponent extends ColoredComponent {
    prog = createElement("div")
    constructor(string: string) {
        super();
        this.wrapper.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        this.wrapper.classList.add("wbutton", Color.Grayscaled, ButtonStyle.Normal)
        this.wrapper.append(loadingWheel());
        this.wrapper.onkeydown = accessibilityButton(this.wrapper)
        this.wrapper.append(string);
    }
    setEnabled = (enabled: boolean) => this.wrapper.classList.replace(...enableTuple(enabled))
    setStyle(style: ButtonStyle, progress?: number) {
        this.wrapper.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
        changeClassAtIndex(this.wrapper, style, 2);
        if (style === ButtonStyle.Spinner) {
            this.wrapper.classList.add("loading");
        }
        if (progress !== undefined && style === ButtonStyle.Progress) {
            this.prog.classList.add("progress");
            this.prog.style.width = `${progress.toString()}%`;
            this.wrapper.append(this.prog);
        }
        return this;
    }
    asLinkButton(link: string): ButtonComponent {
        this.wrapper.href = link;
        return this;
    }
    onClick(func: (e: ButtonComponent) => void) {
        if (this.wrapper.classList.contains(Color.Disabled)) return this;
        this.wrapper.addEventListener('click', () => func(this))
        return this;
    }
    setColor(color: Color) {
        this.setEnabled = (enabled: boolean) => this.wrapper.classList.replace(...enableTuple(enabled, color))
        this.wrapper.tabIndex = speicalSyles.includes(this.wrapper.classList[ 3 ] as ButtonStyle) ? -1 : accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        return this;
    }
}
export const Button = (string: string) => new ButtonComponent(string);