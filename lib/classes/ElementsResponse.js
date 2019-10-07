"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementModify_1 = require("./ElementModify");
class ElementResponse {
    constructor(elements, element) {
        this.e = elements;
        this.id = element.id;
        this.mod = new ElementModify_1.ElementModifyer(element);
    }
}
exports.ElementResponse = ElementResponse;
