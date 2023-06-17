import { asPointer } from "../State.ts";

export const createElement: <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => HTMLElementTagNameMap[ K ]
    = <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => window.document.createElement(tagName, options);

/**
 * @deprecated will be removed. use Image()
 */
export const img = (source: string | undefined, ...classList: string[]) => {
    const img = createElement('img') as HTMLImageElement;
    img.classList.add(...classList);
    if (source) img.src = source;
    return img;
};

/**
 * @deprecated will be removed. use Custom()
 */
export function custom(type: keyof HTMLElementTagNameMap, message: undefined | string | HTMLElement, ...classList: string[]): HTMLElement {
    const span = createElement(type);
    span.classList.add(...classList);

    if (typeof message == "string")
        span.innerText = message;
    else if (message != undefined)
        span.append(message);
    return span;
}

const mobileQuery = matchMedia("(max-width: 750px)");
export const isMobile = asPointer(mobileQuery.matches);
mobileQuery.addEventListener("change", () => isMobile.setValue(mobileQuery.matches));