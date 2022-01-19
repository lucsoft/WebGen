import { Component } from "../../types.ts";

export const Custom = (text: HTMLElement): Component => new class extends Component {
    wrapper = text
}