import { Component } from "../../types";
import { headless } from "../cards/headlessCard";
import { createElement } from "../Components";
import { Custom } from "./Custom";

export const Card = (compoent: Component): Component => {
    const card = createElement('card' as any);
    return Custom(headless(compoent.draw()).draw(card));
}