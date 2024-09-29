import { mediaQueryRef } from "../../src/components/MediaQuery.ts";

export const isDarkModePreferred = mediaQueryRef("(prefers-color-scheme: dark)");