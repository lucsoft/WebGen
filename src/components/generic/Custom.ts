export const Custom = (text: HTMLElement) => {
    const settings = {
        draw: () => text,
        addClass: (...classes: string[]) => {
            text.classList.add(...classes);
            return settings;
        }
    }
    return settings;
}