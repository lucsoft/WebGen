import { Color } from "../lib/Color";

export type ColorDef = { [ color in Color ]: [ hue: number, saturation: number, lightness: number, font: string ] };