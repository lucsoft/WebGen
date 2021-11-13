import { Color } from "../../lib/Color";
import { createElement } from "../Components";
import '../../css/checkbox.webgen.static.css';
import { changeClassAtIndex, conditionalCSSClass } from "../Helper";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility";
import { CommonIcon, CommonIconType, Icon } from "./Icon";
import { BaseComponent } from "../../types";

export interface CheckBoxComponent extends BaseComponent<CheckBoxComponent, HTMLDivElement> {
    setColor: (color: Color) => CheckBoxComponent
    onClick: (action: (value: boolean) => void) => CheckBoxComponent
}

export const Checkbox = (selected = false, icon = CommonIcon(CommonIconType.Done)): CheckBoxComponent => {
    let button = createElement("div");
    button.tabIndex = accessibilityDisableTabOnDisabled();
    button.classList.add("wcheckbox", Color.Grayscaled)
    if (selected) button.classList.add("selected");
    button.append(Icon(icon).draw())
    button.onkeydown = accessibilityButton(button)
    let onClick = (value: boolean) => { };
    button.onclick = () => {
        if (button.classList.contains(Color.Disabled)) return;
        const selected = button.classList.contains("selected");
        conditionalCSSClass(button, !selected, "selected");
        setTimeout(() => onClick(selected), 300)
    }
    const settings: CheckBoxComponent = {
        draw: () => button,
        addClass: (...classes: string[]) => {
            button.classList.add(...classes);
            return settings;
        },
        setColor: (color: Color) => {
            button.tabIndex = accessibilityDisableTabOnDisabled(color);
            changeClassAtIndex(button, color, 1);
            return settings;
        },
        onClick: (action: (value: boolean) => void) => {
            onClick = action;
            return settings;
        }
    };
    return settings;
}