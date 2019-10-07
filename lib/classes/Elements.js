"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementModify_1 = require("./ElementModify");
const WebGenElements_1 = require("./WebGenElements");
class Elements {
    layout(id, remove = false) {
        if (remove) {
            var ele = document.getElementById(id);
            if (ele != undefined) {
                ele.remove();
            }
        }
        else {
            var child = document.createElement("article");
            child.id = id;
            document.getElementsByTagName("body")[0].appendChild(child);
            return { element: new ElementModify_1.ElementModifyer(child) };
        }
    }
    clear(addto = { type: "id", name: "page" }) {
        if (addto.type == "id") {
            var ele = document.getElementById(addto.name);
            if (ele != undefined) {
                ele.innerHTML = "";
            }
        }
        else if (addto.type == "firstTag") {
            var eleG = document.getElementsByTagName(addto.name)[0];
            if (eleG != undefined) {
                eleG.innerHTML = "";
            }
        }
    }
    add(addto = { type: "id", name: "page" }) {
        if (addto.type == "id") {
            var ele = document.getElementById(addto.name);
            if (ele != undefined) {
                return new WebGenElements_1.WebGenElements(ele);
            }
            var article = document.createElement("article");
            article.id = addto.name;
            document.getElementsByTagName("body")[0].append(article);
            return new WebGenElements_1.WebGenElements(article);
        }
        else if (addto.type == "firstTag") {
            var eleG = document.getElementsByTagName(addto.name)[0];
            if (eleG != undefined) {
                return new WebGenElements_1.WebGenElements(eleG);
            }
            var article = document.createElement("article");
            article.id = addto.name;
            document.getElementsByTagName("body")[0].append(article);
            return new WebGenElements_1.WebGenElements(article);
        }
        else {
            var article = document.createElement("article");
            article.id = "page";
            document.getElementsByTagName("body")[0].append(article);
            return new WebGenElements_1.WebGenElements(article);
        }
    }
}
exports.Elements = Elements;
