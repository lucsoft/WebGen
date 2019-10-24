import { ElementModifyer } from "./ElementModify";
import { WebGenElements } from "./WebGenElements";
import { Style } from "./Style";

export class Elements {
    style: Style;
    constructor(style: Style) {
        this.style = style;
    }
    layout(id: string, remove: true | false = false) {
        if (remove) {
            var ele = document.getElementById(id);
            if (ele != undefined) {
                ele.remove();
            }
        } else {
            var child = document.createElement("article")
            child.id = id;
            document.getElementsByTagName("body")[0].appendChild(child);
            return { element: new ElementModifyer(child) };
        }
    }
    clear(addto: { type: "id" | "firstTag", name: string } = { type: "id", name: "page" }) {
        if (addto.type == "id") {
            var ele = document.getElementById(addto.name);
            if (ele != undefined) {
                ele.innerHTML = "";
            }
        } else if (addto.type == "firstTag") {
            var eleG = document.getElementsByTagName(addto.name)[0];
            if (eleG != undefined) {
                eleG.innerHTML = "";
            }
        }
    }
    add(ele: HTMLElement) {
        if (ele.nodeName == "ARTICLE") {
            var article = document.createElement("article");
            ele.append(article);
            return new WebGenElements(article, this.style);
        } else {
            return new WebGenElements(ele, this.style);
        }
    }

}