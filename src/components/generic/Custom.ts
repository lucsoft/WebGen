import { Component } from "../../types.ts";

export class CustomComponent extends Component {
    constructor(text: HTMLElement) {
        super();
        this.wrapper = text;
    }
}
export const Custom = (text: HTMLElement) => new CustomComponent(text);