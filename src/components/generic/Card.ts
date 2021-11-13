import { Component } from "../../types";
import { headless } from "../cards/headlessCard";
import { createElement } from "../Components";

export const Card = (compoent: Component): Component => {
    const card = createElement('card' as any);
    return headless(compoent).draw(card);
}