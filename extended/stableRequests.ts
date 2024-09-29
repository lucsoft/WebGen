import { assert } from "jsr:@std/assert@^0.226.0";
import { retry } from "jsr:@std/async@^0.224.2";

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
