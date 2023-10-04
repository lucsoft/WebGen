import { asPointer } from "./State.ts";

const mobileQuery = matchMedia("(max-width: 750px)");
export const isMobile = asPointer(mobileQuery.matches);
mobileQuery.addEventListener("change", () => isMobile.setValue(mobileQuery.matches));
