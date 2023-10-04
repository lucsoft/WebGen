
export const lazyInit = <T>(fn: () => T) => {
    let prom: T = undefined!;
    return () => prom = (prom || fn());
};
