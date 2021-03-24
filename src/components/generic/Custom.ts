import { RenderElement } from "../../types";

export const Custom = (text: HTMLElement): RenderElement => ({
    draw: () => {
        return text;
    }
})