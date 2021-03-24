import { RenderElement } from "../../types";
import { createElement } from "../Components";

export const Button = (settings: {
    big: boolean,
    list: {
        text: string, onclick: (e: HTMLButtonElement) => void
    }[]
}): RenderElement => ({
    draw: () => {
        let element = createElement("center");
        settings.list.forEach(x => {
            let button = createElement("button") as HTMLButtonElement;
            if (settings.big) button.classList.add("one")
            button.innerHTML = x.text;
            button.onclick = () => x.onclick(button);
            element.append(button);
        });
        return element;
    }
})