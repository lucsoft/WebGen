import { css } from "../core/mod.ts";

export const wgStyleValues = css`
    :root {
        --wg-gap: 10px;

        --wg-radius-tiny: 0.3rem;
        --wg-radius-mid: 0.5rem;
        --wg-radius-large: 0.8rem;
        --wg-radius-complete: 100rem;
        --wg-radius-none: 0;

        --wg-shadow-0: 0 1px 2px rgba(0, 0, 0, 0), 0 1px 3px 1px rgba(0, 0, 0, 0);
        --wg-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
        --wg-shadow-2: 0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15);
        --wg-shadow-3: 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
        --wg-shadow-4: 0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3);
        --wg-shadow-5: 0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3);

        --wg-fontsize-xs: 0.75rem;
        --wg-lineheight-xs: 1rem;
        --wg-fontsize-sm: 0.875rem;
        --wg-lineheight-sm: 1.25rem;
        --wg-fontsize-base: 1rem;
        --wg-lineheight-base: 1.5rem;
        --wg-fontsize-lg: 1.125rem;
        --wg-lineheight-lg: 1.75rem;
        --wg-fontsize-xl: 1.25rem;
        --wg-lineheight-xl: 1.75rem;
        --wg-fontsize-2xl: 1.5rem;
        --wg-lineheight-2xl: 2rem;
        --wg-fontsize-3xl: 1.875rem;
        --wg-lineheight-3xl: 2.25rem;
        --wg-fontsize-4xl: 2.25rem;
        --wg-lineheight-4xl: 2.5rem;
        --wg-fontsize-5xl: 3rem;
        --wg-lineheight-5xl: 1;
        --wg-fontsize-6xl: 3.75rem;
        --wg-lineheight-6xl: 1;
        --wg-fontsize-7xl: 4.5rem;
        --wg-lineheight-7xl: 1;
        --wg-fontsize-8xl: 6rem;
        --wg-lineheight-8xl: 1;
        --wg-fontsize-9xl: 8rem;
        --wg-lineheight-9xl: 1;

        --wg-fontweight-thin: 100;
        --wg-fontweight-extralight: 200;
        --wg-fontweight-light: 300;
        --wg-fontweight-normal: 400;
        --wg-fontweight-medium: 500;
        --wg-fontweight-semibold: 600;
        --wg-fontweight-bold: 700;
        --wg-fontweight-extrabold: 800;
        --wg-fontweight-black: 900;
    }
`;