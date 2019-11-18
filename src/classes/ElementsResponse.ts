import { ElementModifyer } from './ElementModify';
import { WebGenElements } from './WebGenElements';

export class ElementResponse
{
    next: WebGenElements;
    getId: string;
    modify: ElementModifyer;
    constructor(elements: WebGenElements, element: HTMLElement)
    {
        this.next = elements;
        this.getId = element.id;
        this.modify = new ElementModifyer(element);
    }
}
