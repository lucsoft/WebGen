import { asRef } from "../state.ts";
import { Box } from "./box.ts";

export function Empty() {
    return Box(asRef([]));
}