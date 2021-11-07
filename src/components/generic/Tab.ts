import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement } from "../Components";
import '../../css/tab.webgen.static.css';
import { accessibilityDisableTabOnDisabled } from "../../lib/Accessibility";
import { Custom } from "./Custom";

export const Tab = ({ color, selectedIndex, selectedOn }: {
    color?: Color,
    selectedIndex?: number,
    selectedOn?: (index: number) => void,
}, ...dropdown: ([ displayName: string, action: () => void ])[]): Component => {
    let tabbar = createElement("div") as HTMLDivElement;
    tabbar.classList.add("wtab", color ?? Color.Grayscaled)
    tabbar.tabIndex = accessibilityDisableTabOnDisabled(color);
    let focusSelectedIndex = 0
    tabbar.onkeydown = ({ key }) => {
        if (key == "Enter") {
            getItems(tabbar)[ focusSelectedIndex ].click();
            return;
        }
        focusSelectedIndex += (key == "ArrowRight" ? 1 : -1);
        if (focusSelectedIndex == -1) focusSelectedIndex = dropdown.length - 1;
        if (focusSelectedIndex == dropdown.length) focusSelectedIndex = 0;
        tabbar.onblur?.(null as any)
        getItems(tabbar)[ focusSelectedIndex ].classList.add("hover");
    };
    tabbar.onfocus = () => {
        focusSelectedIndex = 0;
        getItems(tabbar)[ focusSelectedIndex ].classList.add("hover");
    }
    tabbar.onblur = () => getItems(tabbar).forEach(x => x.classList.remove("hover"));

    dropdown.forEach(([ displayName, action ], index) => {
        let item = createElement("div");
        item.classList.add('item');
        item.onclick = () => { action(); selectedOn?.(index); };
        item.innerText = displayName.toUpperCase();
        tabbar.append(item);
        if (selectedIndex == index) item.classList.add("active");
    })

    return Custom(tabbar);
}

function getItems(tabbar: HTMLDivElement): HTMLElement[] {
    return tabbar.querySelectorAll("div.item") as any;
}
