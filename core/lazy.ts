/**
 * Lazily evaluates a callback function and caches its result.
 *
 *
 * @example ```ts
 * const lazyValue = lazy(() => {
 *    console.log("This will only be logged once.");
 *    return 42;
 * });
 *
 * console.log(lazyValue()); // Logs "This will only be logged once." and prints 42.
 * console.log(lazyValue()); // Prints 42.
 * ```
 * @template T The type of the result returned by the callback function.
 * @param callback A function that returns the result of the lazy evaluation.
 * @returns A function that, when called, returns the cached result of the callback function.
 */
export const lazy = <T>(callback: () => T) => {
    let result: T = undefined!;
    return () => result = (result || callback());
};
