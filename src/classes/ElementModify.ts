export class ElementModifyer {
    element: HTMLElement;
    constructor(element: HTMLElement) {
        this.element = element;
    }
    addClass(name: string) {
        this.element.classList.add(name);
        return this;
    }
    removeClass(name: string) {
        this.element.classList.add(name);
        return this;
    }
    setID(id: string) {
        this.element.id = id;
    }
}