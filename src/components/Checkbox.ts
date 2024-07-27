import { accessibilityDisableTabOnDisabled } from "../Accessibility.ts";
import { Color } from "../Color.ts";
import { Component } from "../Component.ts";
import { MIcon } from "../icons/MaterialIcons.ts";
import { asRef, Refable, Reference } from "../State.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import './CheckBox.css';

class CheckboxComponent extends ColoredComponent {
    constructor(private selected: Reference<boolean>, icon: Component) {
        super();
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled();
        this.addClass(this.selected.map((v) => v ? "selected" : "unselected"), "wcheckbox");
        this.wrapper.append(icon.draw());
        this.wrapper.addEventListener('click', () => {
            this.selected.setValue(!this.selected.getValue());
        });
    }
    onClick(action: (me: MouseEvent, value: boolean) => void) {
        this.wrapper.addEventListener('click', (me) => {
            if (this.wrapper.classList.contains(Color.Disabled)) return;
            action(me, this.selected.getValue());
        });
        return this;
    }
    setStyle(_style: ButtonStyle): this {
        throw new Error("Method not implemented.");
    }

}
export const Checkbox = (selected: Refable<boolean> = false, icon = MIcon("check")) => new CheckboxComponent(asRef(selected), icon);