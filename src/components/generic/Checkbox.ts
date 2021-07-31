import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement, draw } from "../Components";
import '../../css/checkbox.webgen.static.css';
import { conditionalCSSClass } from "../Helper";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility";
import { CommonIcon, CommonIconType, Icon } from "./Icon";

export const Checkbox = ({ color, selected, toggledOn, icon }: {
    color?: Color,
    selected?: boolean,
    toggledOn?: (value: boolean) => void,
    icon?: string
}): Component => {
    let button = createElement("div") as HTMLDivElement;
    button.tabIndex = accessibilityDisableTabOnDisabled(color);
    button.classList.add("wcheckbox", color ?? Color.Grayscaled)
    if (selected) button.classList.add("selected");
    button.append(draw(Icon(icon ?? CommonIcon(CommonIconType.Done))))
    button.onkeydown = accessibilityButton(button)
    button.onclick = () => {
        if (button.classList.contains(Color.Disabled)) return;
        conditionalCSSClass(button, !button.classList.contains("selected"), "selected");

        setTimeout(() => toggledOn?.(button.classList.contains("selected")), 300)
    }
    return button;
}