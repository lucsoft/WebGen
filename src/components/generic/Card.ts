import { CommonCard, Component } from "../../types";
import { headless } from "../cards/headlessCard";
import { createElement, draw } from "../Components";

export const Card = (compoent: Component): Component => {
    const card = createElement('card');
    return headless(draw(compoent)).draw(card);
}