export interface PaginationObject<T> {
    next: () => Promise<{ items: T[], hasMore: boolean; }>;
}

export function createIndexPaginationLoader<T extends object>(options: {
    limit: number;
    loader: (offset: number, limit: number) => Promise<T[]>;
}): PaginationObject<T> {
    let offset = 0;
    let hasMore = true;
    return {
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