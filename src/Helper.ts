export const conditionalCSSClass = (element: HTMLElement, condition: boolean | undefined, className: string) =>
    element.classList[ condition === true ? "add" : "remove" ](className);

export const dropNullish = (...components: (Component | null | undefined)[]) => components.filter(x => x) as Component[];

import { Component } from "./Component.ts";
import { createElement } from "./Components.ts";

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
    const entries = Object.entries(Object.groupBy(data, ([ key ]) => key)) as [ key: string, value: [ key: string, value: FormDataEntryValue ][] ][];
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

export async function createFilePicker(accept: string): Promise<File> {
    const fileSignal = Promise.withResolvers<File>();
    const input = createElement("input");
    input.type = "file";
    input.hidden = true;
    input.accept = accept;

    input.addEventListener("change", () => {
        fileSignal.resolve(Array.from(input.files ?? [])[ 0 ]!);
    });

    input.showPicker();
    return await fileSignal.promise;
}
