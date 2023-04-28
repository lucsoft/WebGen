import { Component } from "../types.ts";

export const conditionalCSSClass = (element: HTMLElement, condition: boolean | undefined, className: string) =>
    element.classList[ condition === true ? "add" : "remove" ](className);

export const dropNullish = (...components: (Component | null | undefined)[]) => components.filter(x => x) as Component[];

export const changeClassAtIndex = (component: HTMLElement, newString: string, index: number) => component.classList.replace(component.classList[ index ], newString);

import { groupBy } from "https://deno.land/std@0.185.0/collections/group_by.ts";

/**
 * fromEntries can't handle duplicates
 *
 * this method turns
 *
 *  ["key", "value"]
 *  ["list", "one"]
 *  ["list", "two"]
 *
 * to
 *
 *  {
 *    key: "value"
 *    list: ["one", "two"]
 *  }
 */
export function extendedFromEntries(data: [ key: string, value: FormDataEntryValue ][]) {
    const entries = Object.entries(groupBy(data, ([ key ]) => key)) as [ key: string, value: [ key: string, value: FormDataEntryValue ][] ][];
    const pureEntries = entries.map(([ key, value ]) => {
        const values = value.map(([ _, data ]) => data);
        if (values.length == 1)
            return [ key, values[ 0 ] ];
        return [ key, values ];
    });
    return {
        ...Object.fromEntries(pureEntries)
    };
}