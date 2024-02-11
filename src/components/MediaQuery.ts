import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { asRef } from "../State.ts";
import { Custom } from "./Custom.ts";

export function MediaQuery(query: string, view: (matches: boolean) => Component) {
    const holder = createElement("div");
    holder.innerHTML = "";
    holder.style.display = "contents";
    holder.append(view(matchMedia(query).matches).draw());
    matchMedia(query).addEventListener("change", ({ matches }) => {
        holder.innerHTML = "";
        holder.append(view(matches).draw());
    }, { passive: true });
    return Custom(holder);
}

export function mediaQueryRef(matchString: string) {
    const query = matchMedia(matchString);
    const pointer = asRef(query.matches);
    query.addEventListener("change", ({ matches }) => pointer.setValue(matches), { passive: true });
    return pointer;
}