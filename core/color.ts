export class Color {
    constructor(private value: string) { }

    static primary = new Color("var(--wg-primary)");
    static primaryText = new Color("var(--wg-primary-text)");
    static black = new Color("var(--wg-black)");
    static white = new Color("var(--wg-white)");
    static neutral = new Color("var(--wg-neutral)");
    static reverseNeutral = new Color("var(--wg-reverse-neutral)");
    static transparent = new Color("transparent");

    mix(color: Color, percentage: number | string) {
        return `color-mix(in oklab, ${this.value}, ${color.value} ${typeof percentage == "number" ? `${percentage}%` : percentage})`;
    }

    toString() {
        return this.value;
    }
}
