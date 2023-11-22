import { retry } from "https://deno.land/std@0.202.0/async/retry.ts";
import { deferred } from "https://deno.land/std@0.207.0/async/deferred.ts";
import { Pointer, asPointer } from "./src/State.ts";

export interface PaginationObject<T> {
    reset: () => void;
    next: () => Promise<{ items: T[], hasMore: boolean; }>;
}

export interface CachedPages<T extends object> extends PaginationObject<T> {
    items: Pointer<T[]>;
    hasMore: Pointer<boolean>;
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
    const items = asPointer<T[]>([]);
    const hasMore = asPointer<boolean>(true);
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

export type WebSocketContext = {
    send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
    close: () => void;
};

export async function createStableWebSocket(connection: {
    url: string,
    protocol?: string | string[];
}, events: {
    onReconnect?: () => void;
    onMessage?: (message: string | ArrayBuffer) => void;
}): Promise<WebSocketContext> {
    let socket: WebSocket | undefined = undefined;
    let close = false;
    const pooledMessages: (string | ArrayBufferLike | Blob | ArrayBufferView)[] = [];
    function send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        pooledMessages.push(data);
    }
    const socketFirstTimeConnected = deferred<void>();
    console.debug(connection.url, "start");
    (async () => {
        try {
            while (!close) {
                await retry(async () => {
                    const socketClosed = deferred<void>();
                    const websocket = new WebSocket(connection.url, connection.protocol);
                    socket = websocket;
                    let activePool: undefined | number;
                    websocket.addEventListener("open", () => {
                        console.debug(connection.url, "connected");
                        activePool = setInterval(() => {
                            if (pooledMessages.length > 0) {
                                websocket.send(pooledMessages.shift()!);
                            }
                        }, 10);
                        events.onReconnect?.();
                        socketFirstTimeConnected.resolve();
                    }, { once: true });

                    websocket.addEventListener("close", () => {
                        console.debug(connection.url, "close");
                        clearInterval(activePool);
                        socketClosed.reject();
                    }, { once: true });

                    websocket.addEventListener("error", (error) => {
                        console.debug(connection.url, "error", error);
                    });

                    websocket.addEventListener("message", (message) => {
                        events.onMessage?.(message.data);
                    });
                    await socketClosed;
                });
            }
        } catch (error) {
            console.error("Bad State", error);
        }
    })();
    await socketFirstTimeConnected;
    return {
        send,
        close: () => {
            close = true;
            socket?.close();
        }
    };
}
