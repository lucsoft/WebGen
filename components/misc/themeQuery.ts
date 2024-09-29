import { mediaQueryRef } from "./mediaQueryRef.ts";

export const isDarkModePreferred = mediaQueryRef("(prefers-color-scheme: dark)");