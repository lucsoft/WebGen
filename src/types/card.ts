export const enum CardTypes {
    Default,
    Modern,
    Note,
    Rich,
    Headless
}

export type CommonCard = {
    draw: (preCard: HTMLElement) => HTMLElement
    getSize: () => { width?: number, height?: number }
}
