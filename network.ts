import { assert } from "https://deno.land/std@0.212.0/assert/assert.ts";
import { delay } from "https://deno.land/std@0.212.0/async/delay.ts";
import { pooledMap } from "https://deno.land/std@0.212.0/async/pool.ts";
import { MINUTE } from "https://deno.land/std@0.212.0/datetime/constants.ts";
import { SchedulerPriority, createScheduler } from "./extended/scheduler.ts";
import { Reference, asRef } from "./src/State.ts";
export * from "./extended/scheduler.ts";
export * from "./extended/stableRequests.ts";
export * from "./extended/stableWebSockets.ts";

export interface PaginationObject<T> {
    reset: () => void;
    next: () => Promise<{ items: T[], hasMore: boolean; }>;
}

export interface CachedPages<T extends object> extends PaginationObject<T> {
    items: Reference<T[]>;
    hasMore: Reference<boolean>;
}

export function createIndexPaginationLoader<T extends object>(options: {
    limit: number;
    loader: (offset: number, limit: number) => Promise<T[]>;
}): PaginationObject<T> {
    let offset = 0;
    let hasMore = true;
    return {
        reset: () => {
            offset = 0;
            hasMore = true;
        },
        next: async () => {
            const items = await options.loader(offset, options.limit + 1);
            hasMore = items.length > options.limit;
            if (hasMore)
                items.pop();
            offset += items.length;
            return { items, hasMore };
        }
    };
}

export function createCachedLoader<T extends object>(source: PaginationObject<T>): CachedPages<T> {
    const items = asRef<T[]>([]);
    const hasMore = asRef<boolean>(true);
    return {
        items,
        hasMore,
        reset: () => {
            source.reset();
            items.setValue([]);
            hasMore.setValue(true);
        },
        next: async () => {
            const response = await source.next();
            hasMore.setValue(response.hasMore);
            items.setValue([ ...items.getValue(), ...response.items ]);
            return response;
        }
    };
}

interface Deferred<T> {
    promise: Promise<T>;
    resolve(value?: T | PromiseLike<T>): void;
    // deno-lint-ignore no-explicit-any
    reject(reason?: any): void;
}

export interface Task {
    priority: SchedulerPriority,
    request: Request,
    completed: Deferred<Response>,
}

export enum ThrottleStrategy {
    Static,
    Dynamic
}

export type ThrottledPipelineOptions = (
    | { strategy: ThrottleStrategy.Dynamic; }
    | { strategy: ThrottleStrategy.Static; throughputPerMinute: number; })
    & { curve?: number; concurrency?: number; };

export function createThrottledPipeline(options: ThrottledPipelineOptions) {
    const tasks = createScheduler<Task>();

    let nextReset = Date.now();
    let remaining = options.strategy === ThrottleStrategy.Static ? options.throughputPerMinute : 0;
    if (options.strategy === ThrottleStrategy.Static)
        setInterval(() => {
            nextReset = Date.now();
            remaining = options.strategy === ThrottleStrategy.Static ? options.throughputPerMinute : 0;
        }, 1 * MINUTE);


    let lastHeader: Headers | undefined = undefined;

    const throttler = new class ThrottledStream extends TransformStream<Task, Task> {
        constructor() {
            super({
                transform: async (task, controller) => {
                    const curve = options.curve ?? 1.5;

                    if (options.strategy === ThrottleStrategy.Dynamic) {
                        const headers = lastHeader;
                        if (headers) {
                            const limit = Number(headers.get("X-Ratelimit-Limit") ?? headers.get("X-Rate-Limit-Limit")); // How many requests we can make in this minute
                            const remaining = Number(headers.get("X-Ratelimit-Remaining") ?? headers.get("X-Rate-Limit-Remaining")); // How many requests we have left in this minute
                            const reset = Number(headers.get("X-Ratelimit-Reset") ?? headers.get("X-Rate-Limit-Reset")); // How many seconds until the ratelimit resets
                            assert(!isNaN(limit) || !isNaN(remaining) || !isNaN(reset), "Ratelimit headers are not numbers");

                            await delay(Math.pow((1 - (remaining / limit)), curve) * reset * 1000);
                        }
                    } else {
                        const reset = (Date.now() - nextReset) / 1000;
                        await delay(Math.pow((1 - (remaining / options.throughputPerMinute)), curve) * reset * 1000);
                        remaining--;
                    }
                    controller.enqueue(task);
                }
            });
        }


    };

    const sourceStream = tasks.scheduler
        .pipeThrough(throttler);

    pooledMap(options.concurrency ?? 1,
        sourceStream,
        async (task) => {
            try {
                const response = await fetch(task.request, {
                    mode: options.strategy === ThrottleStrategy.Dynamic ? "no-cors" : "cors"
                });
                task.completed.resolve(response);
                lastHeader = response.headers;
            } catch (error) {
                task.completed.reject(error);
            }
        }
    );

    return {
        fetch: (priority: SchedulerPriority, request: Request | string) => {
            const completed = Promise.withResolvers<Response>();
            const requestObj = typeof request === "string" ? new Request(request) : request;
            tasks.add({
                priority,
                request: requestObj,
                completed
            });
            return completed.promise;
        }
    };
}