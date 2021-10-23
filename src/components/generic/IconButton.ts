import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement, draw } from "../Components";
import '../../css/iconbutton.webgen.static.css';
import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility";
import { CommonIcon, CommonIconType, Icon } from "./Icon";

export const IconButton = ({ color, icon, clickOn }: {
    color?: Color,
    icon: CommonIconType | string,
    clickOn?: () => void
}): Component => {
    let button = createElement("div") as HTMLDivElement;
    button.tabIndex = accessibilityDisableTabOnDisabled(color);
    button.classList.add("wiconbutton", color ?? Color.Grayscaled)
    button.onclick = () => clickOn?.()
    button.append(draw(Icon(typeof icon == "number" ? CommonIcon(icon) : icon)))
    return button;
}