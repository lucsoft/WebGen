import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../Accessibility.ts";
import { Color } from "../Color.ts";
import { Component } from "../Component.ts";
import { conditionalCSSClass } from "../Helper.ts";
import { MIcon } from "../icons/MaterialIcons.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import './CheckBox.css';

class CheckboxComponent extends ColoredComponent {

    constructor(selected: boolean, icon: Component) {
        super();
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled();
        this.wrapper.classList.add("wcheckbox");
        if (selected) this.wrapper.classList.add("selected");
        this.wrapper.append(icon.draw());
        this.wrapper.onkeydown = accessibilityButton(this.wrapper);
    }
    onClick(action: (me: MouseEvent, value: boolean) => void) {
        this.wrapper.addEventListener('click', (me) => {
            if (this.wrapper.classList.contains(Color.Disabled)) return;
            const selected = this.wrapper.classList.contains("selected");
            conditionalCSSClass(this.wrapper, !selected, "selected");
            action(me, selected);
        });
        return this;
    }
    setStyle(_style: ButtonStyle): this {
        throw new Error("Method not implemented.");
    }

}
export const Checkbox = (selected = false, icon = MIcon("check")) => new CheckboxComponent(selected, icon);