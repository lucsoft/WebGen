import { Color } from "./Color.ts";

export const accessibilityDisableTabOnDisabled = (color: Color | undefined = Color.Grayscaled): number => color === Color.Disabled ? -1 : 0;
