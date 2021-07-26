import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement } from "../Components";
import '../../css/tab.webgen.static.css';

export const Tab = ({ color, selectedIndex, selectedOn }: {
    color?: Color,
    selectedIndex?: number,
    selectedOn?: (index: number) => void,
}, ...dropdown: ([ displayName: string, action: () => void ])[]): Component => {
    let tabbar = createElement("div") as HTMLDivElement;
    tabbar.classList.add("wtab", color ?? Color.Grayscaled)
    dropdown.forEach(([ displayName, action ], index) => {
        let item = createElement("div");
        item.classList.add('item');
        item.onclick = () => { action(); selectedOn?.(index); };
        item.innerText = displayName.toUpperCase();
        tabbar.append(item);
        if (selectedIndex == index) item.classList.add("active");
    })

    return tabbar;
}