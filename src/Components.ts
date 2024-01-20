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