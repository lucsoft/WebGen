import { Component } from "../types";
import { ButtonActions } from "../types/actions";
import { conditionalCSSClass } from "./Helper";

export const createElement = (type: string) => window.document.createElement(type);

export function draw(component: Component): HTMLElement {
    if (component instanceof HTMLElement) return component;
    return component.draw();
}

export function action(element: HTMLElement, type: string, value: unknown) {
    element.dispatchEvent(new CustomEvent(type, { detail: value }))
}

export const span = (message: undefined | string | HTMLElement, ...classList: string[]): HTMLElement => custom('span', message, ...classList)
export const mIcon = (icon: string, ...classList: string[]) => custom("span", icon, "material-icons-round", "webgen-icon", ...classList);
export const img = (source: string | undefined, ...classList: string[]) => {
    const img = createElement('img') as HTMLImageElement
    img.classList.add(...classList)
    if (source) img.src = source;
    return img;
};
export function custom(type: string, message: undefined | string | HTMLElement, ...classList: string[]): HTMLElement {
    const span = createElement(type);
    span.classList.add(...classList)

    if (typeof message == "string")
        span.innerText = message;
    else if (message != undefined)
        span.append(message);
    return span;
}

/**
 * #Actions
 *  @value (list)
 * @deprecated Please use Vertical()
 */
export function list(options: { margin?: boolean; style?: "none" | "default"; noHeigthLimit?: boolean }, ...listRaw: { left: Component | string; right?: Component | string; click?: () => void; actions?: { type: string, click: () => void }[] }[]) {
    const listE = createElement('list');

    if (!options.margin)
        listE.classList.add('nomargin')

    if (options.style !== "none")
        listE.classList.add('style2')

    if (options.noHeigthLimit)
        listE.classList.add('noHeigthLimit')
    listE.addEventListener("value", (action) => {

        listE.innerHTML = "";
        for (const iterator of (action as CustomEvent).detail) {
            const item = createElement('item');
            if (iterator.click)
                item.onclick = iterator.click;
            const left = createElement('span');
            if (typeof iterator.left === "string") {
                left.classList.add('left');
                left.innerText = iterator.left;
            } else
                left.append(iterator.left)
            item.append(left);
            if (iterator.right !== undefined || (iterator.actions !== undefined && iterator.actions.length !== 0)) {
                const right = createElement('span');
                right.classList.add('right');

                if (iterator.right) {
                    if (iterator.actions && iterator.actions.length > 0)
                        iterator.right.classList.add('always');
                    right.append(iterator.right)
                }

                if (iterator.actions)
                    for (const action of iterator.actions) {
                        const act = mIcon(action.type);
                        act.onclick = action.click;
                        right.append(act);
                    }

                item.append(right);
            }
            listE.append(item);
        }
    })
    listE.dispatchEvent(new CustomEvent("value", { detail: listRaw }))

    return listE;
}