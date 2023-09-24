import { Component } from "../types.ts";

export const conditionalCSSClass = (element: HTMLElement, condition: boolean | undefined, className: string) =>
    element.classList[ condition === true ? "add" : "remove" ](className);

export const dropNullish = (...components: (Component | null | undefined)[]) => components.filter(x => x) as Component[];

/**
 * @deprecated
 */
export const changeClassAtIndex = (component: HTMLElement, newString: string, index: number) => component.classList.replace(component.classList[ index ], newString);

import { groupBy } from "https://deno.land/std@0.202.0/collections/group_by.ts";

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

export function KeyValueStore(map: Map<string, Blob>): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('myDatabase', 1);

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('myStore')) {
                db.createObjectStore('myStore');
            }
        };

        request.onsuccess = (event: any) => {
            const db = event.target.result;
            const transaction = db.transaction([ 'myStore' ], 'readwrite');
            const store = transaction.objectStore('myStore');

            map.forEach((value, key) => {
                const request = store.put(value, key);

                request.onerror = () => {
                    reject(new Error(`Failed to store value with key: ${key}`));
                };
            });

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = () => {
                reject(new Error('Transaction failed'));
            };
        };
    });
}

export const lazyInit = <T>(fn: () => Promise<T>) => {
    let prom: Promise<T> = undefined!;
    return () => prom = (prom || fn());
};