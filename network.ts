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
