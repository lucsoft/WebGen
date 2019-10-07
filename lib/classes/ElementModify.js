"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElementModifyer {
    constructor(element) {
        this.element = element;
    }
    addClass(name) {
        this.element.classList.add(name);
        return this;
    }
    removeClass(name) {
        this.element.classList.add(name);
        return this;
    }
    setID(id) {
        this.element.id = id;
    }
}
exports.ElementModifyer = ElementModifyer;
