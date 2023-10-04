
export const lazyInit = <T>(fn: () => Promise<T>) => {
    let prom: Promise<T> = undefined!;
    return () => prom = (prom || fn());
};
