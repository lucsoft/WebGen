
export const lazy = <T>(callback: () => T) => {
    let result: T = undefined!;
    return () => result = (result || callback());
};
