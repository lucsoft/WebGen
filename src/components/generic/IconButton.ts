import { Color } from "../../lib/Color.ts";
import "../../css/iconbutton.webgen.static.css";
import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";
import { changeClassAtIndex } from "../Helper.ts";
import { ButtonStyle, ColoredComponent } from "../../types.ts";
export class IconButtonComponent extends ColoredComponent {
    constructor(icon: CommonIconType | string) {
        super();
        this.wrapper.classList.add("wiconbutton", Color.Grayscaled);
        this.wrapper.append(
            Icon(typeof icon == "number" ? CommonIcon(icon) : icon).draw(),
        );
    }
    setColor(color: Color) {
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        return this;
    }
    setStyle(_style: ButtonStyle): IconButtonComponent {
        throw new Error("Method not implemented.");
    }
}
export const IconButton = (icon: CommonIconType | string) =>
    new IconButtonComponent(icon);
