import { asRef } from "../../core/mod.ts";

export function mediaQueryRef(matchString: string) {
    const query = matchMedia(matchString);
    const pointer = asRef(query.matches);
    query.addEventListener("change", ({ matches }) => pointer.setValue(matches), { passive: true });
    return pointer;
}