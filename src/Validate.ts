import * as zod from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { StateData, StateHandler, asPointer, listenOnInitalStateKeys } from "./State.ts";
import { getErrorMessage } from "./components/Wizard.ts";

export function Validate<T extends StateData, E extends zod.ZodRawShape>(data: StateHandler<T>, validator: zod.ZodObject<E>) {
    const formPointer = listenOnInitalStateKeys(data);

    const error = asPointer<zod.ZodError | undefined>(undefined);

    formPointer.listen(() => error.setValue(undefined));

    return {
        data,
        error,
        errorMessage: error.map(error => error ? getErrorMessage({ isValid: { success: false, error } }) : undefined),
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
