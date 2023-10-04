import { Component } from "../Component.ts";

export class CustomComponent extends Component {
    constructor(text: HTMLElement) {
        super();
        this.wrapper = text;
    }
}
export const Custom = (text: HTMLElement) => new CustomComponent(text);