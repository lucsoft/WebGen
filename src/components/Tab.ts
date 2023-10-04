import { accessibilityDisableTabOnDisabled } from "../Accessibility.ts";
import { Color } from "../Color.ts";
import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { Custom } from "./Custom.ts";
import './Tab.css';

/**
 * @deprecated Options to be replaced with build style
 */
export const Tab = ({ color, selectedIndex, selectedOn }: {
    color?: Color,
    selectedIndex?: number,
    selectedOn?: (index: number) => void,
}, ...dropdown: ([ displayName: string, action: () => void ])[]): Component => {
    const tabbar = createElement("div") as HTMLDivElement;
    tabbar.classList.add("wtab", color ?? Color.Grayscaled);
    tabbar.tabIndex = accessibilityDisableTabOnDisabled(color);
    let focusSelectedIndex = 0;
    tabbar.onkeydown = ({ key }) => {
        if (key == "Enter") {
            getItems(tabbar)[ focusSelectedIndex ].click();
            return;
        }
        focusSelectedIndex += (key == "ArrowRight" ? 1 : -1);
        if (focusSelectedIndex == -1) focusSelectedIndex = dropdown.length - 1;
        if (focusSelectedIndex == dropdown.length) focusSelectedIndex = 0;
        tabbar.onblur?.(null as unknown as FocusEvent);
        getItems(tabbar)[ focusSelectedIndex ].classList.add("hover");
    };
    tabbar.onfocus = () => {
        focusSelectedIndex = 0;
        getItems(tabbar)[ focusSelectedIndex ].classList.add("hover");
    };
    tabbar.onblur = () => getItems(tabbar).forEach(x => x.classList.remove("hover"));

    dropdown.forEach(([ displayName, action ], index) => {
        const item = createElement("div");
        item.classList.add('item');
        item.onclick = () => { action(); selectedOn?.(index); };
        item.innerText = displayName;
        tabbar.append(item);
        if (selectedIndex == index) item.classList.add("active");
    });

    return Custom(tabbar);
};

function getItems(tabbar: HTMLDivElement): NodeListOf<HTMLElement> {
    return tabbar.querySelectorAll<HTMLElement>("div.item");
}
