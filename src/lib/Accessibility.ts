import { Color } from "./Color";

export const accessibilityButton = (button: HTMLElement): (ev: KeyboardEvent) => any => ({ key }) => {
    if ([ "Enter", "Space" ].includes(key)) {
        button.click();
    }
}
export const accessibilityDisableTabOnDisabled = (color: Color | undefined): number => color === Color.Disabled ? -1 : 0;
