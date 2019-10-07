export declare class ElementModifyer {
    element: HTMLElement;
    constructor(element: HTMLElement);
    addClass(name: string): this;
    removeClass(name: string): this;
    setID(id: string): void;
}
