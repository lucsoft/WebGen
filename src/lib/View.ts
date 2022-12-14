import { createElement } from "../components/Components.ts";
import type { Component, ViewOptions, ViewOptionsFunc } from "../types.ts";
import '../css/cards.webgen.static.css';
import { Custom } from "../components/generic/Custom.ts";
export class ViewClass<State>
{
    #appendOnElement: HTMLElement | null = null;
    #hasMaxWidth: string | null = null;
    #cssClasses: string[] = [];
    #render: ViewOptionsFunc<State>;
    #state = {} as State;
    #activeCompnents: Component[] = [];
    #shell = createElement('article');

    constructor(render: ViewOptionsFunc<State>) {
        this.#render = render;
    }
    #renderFunction() {
        const data = this.#render({
            state: this.#state,
            update: (data) => {
                Object.assign(this.#state, data);
                this.#renderFunction();
            },
            use: (comp) => this.#activeCompnents.push(comp)
        });
        if (data) this.#activeCompnents.push(data);
        const newShell = createElement('article');
        if (this.#hasMaxWidth) {
            newShell.classList.add('maxWidth');
            newShell.style.maxWidth = this.#hasMaxWidth;
        }
        newShell.classList.add(...this.#cssClasses);
        newShell.append(...this.#activeCompnents.map(x => x.draw()));
        this.#appendOnElement?.replaceChild(newShell, this.#shell);
        this.#activeCompnents = [];
        this.#shell = newShell;
    }

    setMaxWidth(maxWidth: string) {
        this.#hasMaxWidth = maxWidth;
        if (this.#appendOnElement) this.#renderFunction();
        return this;
    }
    change(viewOptions: (data: ViewOptions<State>) => void) {
        viewOptions(this.viewOptions());
        return this;
    }
    viewOptions(): ViewOptions<State> {
        return {
            state: this.#state,
            update: (data) => {
                Object.assign(this.#state, data);
                this.#renderFunction();
            },
            use: (comp) => this.#activeCompnents.push(comp)
        };
    }
    addClass(...classes: string[]) {
        this.#cssClasses.push(...classes);
        if (this.#appendOnElement) this.#renderFunction();
        return this;
    }
    enableCenterFromMiddle() {
        this.#cssClasses.push("flex-center");
        if (this.#appendOnElement) this.#renderFunction();
        return this;
    }
    asComponent() {
        const component = createElement("div");
        if (this.#appendOnElement != null) throw new Error("appendOn can only be used once");

        this.#appendOnElement = component;
        component.append(this.#shell);
        this.#renderFunction();

        return Custom(component);
    }
    appendOn(component: HTMLElement) {
        if (this.#appendOnElement != null) throw new Error("appendOn can only be used once");

        this.#appendOnElement = component;
        component.append(this.#shell);
        this.#renderFunction();
        return this;
    }
}

export const View = <State>(render: ViewOptionsFunc<State>) => new ViewClass<State>(render);