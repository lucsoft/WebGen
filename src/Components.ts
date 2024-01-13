// polyfill hotfix for safari
if ('document' in globalThis && document?.adoptedStyleSheets?.length === 0)
    document.adoptedStyleSheets = [];

/**
 * Creates a CSSStyleSheet from a tagged templates
 *
 * To a WebGen Component:
 *
 * ```js
 * .addStyle(css``);
 * ```
 *
 * Or add styling directly to the html:
 *
 * ```js
 * document.adoptedStyleSheets.push(css`
 *    .footer {
 *        gap: 0.5rem;
 *    }
 *`);
 * ```
 */
export function css(data: TemplateStringsArray, ...expr: string[]) {
    const merge = data.map((x, i) => x + (expr[ i ] || ''));

    const style = new CSSStyleSheet();
    style.replaceSync(merge.join(""));
    return style;
}

export const createElement: <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => HTMLElementTagNameMap[ K ]
    = <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions) => window.document.createElement(tagName, options);

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
