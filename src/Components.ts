import { Component } from "./webgen.ts";

// polyfill hotfix for safari
if (document.adoptedStyleSheets.length == 0)
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

export function Switch<type extends string>(source: type, data: { [ key in type ]: Component; }) {
    return data[ source ];
}
