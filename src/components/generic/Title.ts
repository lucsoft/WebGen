import { RenderElement } from "../../types";
import { createElement, span } from "../Components";

export const Title = (settings: {
    title: string,
    subtitle?: string,
    img?: string,
    type: "small" | "big"
}): RenderElement => ({
    draw: () => {
        if (settings.type == "big") {
            let element = createElement("span");
            if (settings.img != undefined) {
                element.classList.add("titlew", "withimg");
                element.innerHTML = `<img src="${settings.img}", stype="margin-bottom:3.2rem"><br>${settings.title}${settings.subtitle ? `<span class="subtitlew">${settings.subtitle}</span>` : ``}`;
            } else {
                element.classList.add("titlew");
                element.innerHTML = `${settings.title}${settings.subtitle ? `<span class="subtitlew" style="margin-left: 0;${(settings.title.indexOf("y") != -1 || settings.title.indexOf("j") != -1 || settings.title.indexOf("q") != -1 || settings.title.indexOf("p") != -1) ? 'margin-top: 0.5rem;' : ''}">${settings.subtitle}</span>` : ''}`;
            }
            return element;
        }
        else if (settings.type === "small") {
            let element = createElement("h2");
            element.innerHTML = settings.title;

            if (settings.subtitle) {
                const shell = createElement('div')
                let element2 = createElement("h4");
                element2.innerHTML = settings.subtitle;
                let element3 = createElement("br");
                shell.append(element, element2, element3);
                return shell;
            } else
                return element;

        } return span(undefined);
    }
})