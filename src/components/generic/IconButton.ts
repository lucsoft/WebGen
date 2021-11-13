import { Color } from "../../lib/Color";
import { createElement } from "../Components";
import '../../css/iconbutton.webgen.static.css';
import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility";
import { CommonIcon, CommonIconType, Icon } from "./Icon";
import { changeClassAtIndex } from "../Helper";
import { BaseComponent } from "../../types";

export interface IconButtonComponent extends BaseComponent<IconButtonComponent, HTMLDivElement> {
    setColor: (color: Color) => IconButtonComponent
    onClick: (action: () => void) => IconButtonComponent
}

export const IconButton = (icon: CommonIconType | string): IconButtonComponent => {
    let button = createElement("div") as HTMLDivElement;
    button.classList.add("wiconbutton", Color.Grayscaled)
    button.append(Icon(typeof icon == "number" ? CommonIcon(icon) : icon).draw())
    const settigns: IconButtonComponent = {
        draw: () => button,
        addClass: (...classes: string[]) => {
            button.classList.add(...classes);
            return settigns;
        },
        setColor: (color: Color) => {
            button.tabIndex = accessibilityDisableTabOnDisabled(color);
            changeClassAtIndex(button, color, 1);
            return settigns;
        },
        onClick: (action: () => void) => {
            button.onclick = () => action()
            return settigns;
        }
    };
    return settigns;
}