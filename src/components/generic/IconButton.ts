import "../../css/iconbutton.webgen.static.css";
import { ButtonStyle, ColoredComponent } from "../../types.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";
export class IconButtonComponent extends ColoredComponent {
    constructor(icon: CommonIconType | string, label: string) {
        super();
        this.wrapper.classList.add("wiconbutton");
        this.wrapper.append(
            Icon(typeof icon == "number" ? CommonIcon(icon) : icon).draw(),
        );
        this.wrapper.ariaLabel = label;
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
