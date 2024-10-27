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
export function fromFormEntries(data: [ key: string, value: FormDataEntryValue ][]) {
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