import * as zod from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { StateData, StateHandler, asPointer, listenOnInitalStateKeys } from "./State.ts";

export function getErrorMessage(state: zod.ZodError): string {
    const selc = state.errors.find(x => x.code == "custom" && x.message != "Invalid input") ?? state.errors.find(x => x.message != "Required") ?? state.errors[ 0 ];

    // UpperCase and if number box it.
    const path = selc.path.map(x => typeof x == "number" ? `[${x}]` : x.replace(/^./, str => str.toUpperCase())).join("");

    return `${path}: ${selc.message}`;
}

export function Validate<T extends StateData, E extends zod.ZodRawShape>(data: StateHandler<T>, validator: zod.ZodObject<E>) {
    const formPointer = listenOnInitalStateKeys(data);

    const error = asPointer<zod.ZodError | undefined>(undefined);

    formPointer.listen(() => error.setValue(undefined));

    return {
        data,
        error,
        errorMessage: error.map(error => error ? getErrorMessage(error) : undefined),
        validate: () => {
            const response = validator.safeParse(data);
            if (!response.success) {
                error.setValue(response.error);
                return undefined;
            }
            return response.data;
        }
    };
}
