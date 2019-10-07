import { ElementModifyer } from "./ElementModify";
import { WebGenElements } from "./WebGenElements";
export declare class ElementResponse {
    e: WebGenElements;
    id: string;
    mod: ElementModifyer;
    constructor(elements: WebGenElements, element: HTMLElement);
}
