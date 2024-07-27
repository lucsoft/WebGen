import { accessibilityDisableTabOnDisabled } from "../Accessibility.ts";
import { Color } from "../Color.ts";
import { Component } from "../Component.ts";
import { MIcon } from "../icons/MaterialIcons.ts";
import { asRef, Refable } from "../State.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import './CheckBox.css';

class CheckboxComponent extends ColoredComponent {
    #selected = asRef(false);

    constructor(selected: Refable<boolean>, icon: Component) {
        super();
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled();
        this.wrapper.classList.add("wcheckbox");
        asRef(selected).listen((value) => this.#selected.setValue(value));
        this.addClass(this.#selected.map((v) => v ? "selected" : "unselected"));
        this.wrapper.append(icon.draw());
        this.wrapper.addEventListener('click', (me) => {
            this.#selected.setValue(!this.#selected.getValue());
        });
    }
    onClick(action: (me: MouseEvent, value: boolean) => void) {
        this.wrapper.addEventListener('click', (me) => {
            if (this.wrapper.classList.contains(Color.Disabled)) return;
            action(me, this.#selected.getValue());
        });
        return this;
    }
    setStyle(_style: ButtonStyle): this {
        throw new Error("Method not implemented.");
    }

}
export const Checkbox = (selected: Refable<boolean> = false, icon = MIcon("check")) => new CheckboxComponent(selected, icon);