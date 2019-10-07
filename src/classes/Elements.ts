import { ElementModifyer } from "./ElementModify";
import { WebGenElements } from "./WebGenElements";

export class Elements {
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
    add(addto: { type: "id" | "firstTag", name: string } = { type: "id", name: "page" }) {
        if (addto.type == "id") {
            var ele = document.getElementById(addto.name);
            if (ele != undefined) {
                return new WebGenElements(ele);
            }
            var article = document.createElement("article");
            article.id = addto.name;
            document.getElementsByTagName("body")[0].append(article);
            return new WebGenElements(article);
        } else if (addto.type == "firstTag") {
            var eleG = document.getElementsByTagName(addto.name)[0];
            if (eleG != undefined) {
                return new WebGenElements(<HTMLElement>eleG);
            }
            var article = document.createElement("article");
            article.id = addto.name;
            document.getElementsByTagName("body")[0].append(article);
            return new WebGenElements(article);
        } else {
            var article = document.createElement("article");
            article.id = "page";
            document.getElementsByTagName("body")[0].append(article);
            return new WebGenElements(article);

        }
    }

}