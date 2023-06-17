import { Color } from "../../lib/Color.ts";
import "../../css/iconbutton.webgen.static.css";
import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";
import { changeClassAtIndex } from "../Helper.ts";
import { ButtonStyle, ColoredComponent } from "../../types.ts";
import { Pointable, isPointer } from "../../State.ts";
export class IconButtonComponent extends ColoredComponent {
    constructor(icon: CommonIconType | string, label: string) {
        super();
        this.wrapper.classList.add("wiconbutton", Color.Grayscaled);
        this.wrapper.append(
            Icon(typeof icon == "number" ? CommonIcon(icon) : icon).draw(),
        );
        this.wrapper.ariaLabel = label;
    }
    setColor(color: Pointable<Color>) {
        if (isPointer(color)) {
            color.listen((val) => this.setColor(val));
            return this;
        }
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        return this;
    }
    asLinkButton(url: string, target?: string) {
        this.wrapper.href = url;
        if (target)
            this.wrapper.target = target;
        return this;
    }
    setStyle(_style: ButtonStyle): this {
        throw new Error("Method not implemented.");
    }
}
export const IconButton = (icon: CommonIconType | string, label: string) =>
    new IconButtonComponent(icon, label);
