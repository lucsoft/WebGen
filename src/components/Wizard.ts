// deno-lint-ignore-file no-explicit-any
import * as validator from "https://deno.land/x/zod@v3.22.4/mod.ts";

export function getErrorMessage(state: Partial<{ isValid: validator.SafeParseReturnType<any, any>; }>): string {
    if (!(state.isValid && state.isValid?.success !== true)) return "";
    const selc = state.isValid.error.errors.find(x => x.code == "custom" && x.message != "Invalid input") ?? state.isValid.error.errors.find(x => x.message != "Required") ?? state.isValid.error.errors[ 0 ];

    // UpperCase and if number box it.
    const path = selc.path.map(x => typeof x == "number" ? `[${x}]` : x.replace(/^./, str => str.toUpperCase())).join("");

    return `${path}: ${selc.message}`;
}