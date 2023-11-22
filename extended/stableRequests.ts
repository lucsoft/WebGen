import { assert } from "https://deno.land/std@0.202.0/assert/assert.ts";
import { retry } from "https://deno.land/std@0.202.0/async/retry.ts";

export type StableRequest = {
    request: Request;
    failOnNetworkError?: boolean;
    retryOnHttpError?: boolean;
};

export function createStableRequest({
    request,
    failOnNetworkError = false,
    retryOnHttpError = false,
}: StableRequest): Promise<Response> {
    return retry(async () => {
        const response = await retry(() => fetch(request), {
            maxAttempts: failOnNetworkError ? 1 : 3,
            minTimeout: 100
        });

        if (retryOnHttpError)
            assert(response.ok);

        return response;
    });
}
