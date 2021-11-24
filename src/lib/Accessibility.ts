import { Color } from "./Color.ts";

// deno-lint-ignore no-explicit-any
export const accessibilityButton = (button: HTMLElement): (ev: KeyboardEvent) => any => ({ key }) => {
    if ([ "Enter", "Space" ].includes(key)) {
        button.click();
    }
}
export const accessibilityDisableTabOnDisabled = (color: Color | undefined = Color.Grayscaled): number => color === Color.Disabled ? -1 : 0;
