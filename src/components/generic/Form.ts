import { ButtonStyle, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { Button } from './Button.ts';
import { Horizontal, Spacer } from './Stacks.ts';

export class FormComponent extends Component {
    wrapper = createElement("form");
    constructor(compoents: Record<string, Component>) {
        super();

        this.wrapper.append(...Object.entries(compoents).map(([ name, component ]) => {
            const ele = component.draw();
            ele.querySelector("input")!.name = name;
            return ele;
        }));
    }
    onSubmit(title: string, action: (data: FormData) => void | Promise<void>) {
        const button = Button(title).onClick(() => {
            submit.click();
        });
        const submit = createElement("input");
        submit.type = "submit";
        submit.hidden = true;
        this.wrapper.addEventListener('submit', (data) => {
            data.preventDefault();
            button.setStyle(ButtonStyle.Spinner);

            Promise.resolve(action(new FormData(data.target as HTMLFormElement))).finally(() => {
                setTimeout(() => button.setStyle(ButtonStyle.Normal), 1000);
            });
        });
        this.wrapper.action = "#";
        this.wrapper.append(submit, Horizontal(
            Spacer(),
            button
        ).draw());
        return this;
    }
}

export const Form = (data: Record<string, Component>) => new FormComponent(data);