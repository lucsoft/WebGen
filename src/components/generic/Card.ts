import { CommonCard, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { Custom } from "./Custom.ts";

export const Card = (compoent: Component) => {
    const card = createElement('card' as 'div');
    card.append(compoent.draw());
    return Custom(card);
};