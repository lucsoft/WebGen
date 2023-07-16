import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { Custom } from "./Custom.ts";
import { Box } from "./Stacks.ts";

export const GLOBAL_CACHE = new Map<string, {
    // deno-lint-ignore no-explicit-any
    data?: any,
    render: Component;
}>();

export function Cache<Data>(cacheId: string, loader: (() => Promise<Data>) | undefined, render: (type: "cache" | "loaded", data: undefined | Data) => Component) {
    if (!GLOBAL_CACHE.has(cacheId)) {
        const shell = createElement("div");
        shell.style.display = "contents";
        GLOBAL_CACHE.set(cacheId, {
            render: Custom(shell)
        });

        shell.append(render("cache", undefined).draw());
        loader?.()
            .then(x => render("loaded", x))
            .then(x => x.draw())
            .then(x => shell.children[ 0 ].replaceWith(x));
    }

    const data = GLOBAL_CACHE.get(cacheId)!;
    return Box(data.render);
}