import { RenderElement } from "../../types";
import { span } from "../Components";

export const PageTitle = (text: string): RenderElement => ({
    draw: () => {
        let element = span(text, 'pagetitle');
        return element;
    }
})