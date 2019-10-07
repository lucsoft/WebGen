import { ElementModifyer } from "./ElementModify";
import { WebGenElements } from "./WebGenElements";

export class ElementResponse {
    e: WebGenElements;
    id: string;
    mod: ElementModifyer;
    constructor(elements: WebGenElements, element: HTMLElement) {
        this.e = elements;
        this.id = element.id;
        this.mod = new ElementModifyer(element);
    }
}
