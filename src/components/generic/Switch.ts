import "../../css/switch.webgen.static.css";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { Color } from "../../lib/Color.ts";
import { asPointer, Pointable, Pointer } from "../../State.ts";
import { ButtonStyle, ColoredComponent } from "../../types.ts";
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { Custom } from "./Custom.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";
import { Box } from "./Stacks.ts";

class SwitchComponent extends ColoredComponent {
    loading = asPointer(false);
    selected: Pointer<boolean>;
    constructor(selected: Pointer<boolean>) {
        super();
        this.selected = selected;
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled();
        this.addClass(selected.map(it => it ? "selected" : "unselected"), "wswitch", Color.Grayscaled);
        this.addClass(this.loading.map(it => it ? 'loading' : 'non-loading'));
        this.wrapper.onkeydown = accessibilityButton(this.wrapper);
        this.wrapper.append(Box(
            Icon(CommonIcon(CommonIconType.Done)).addClass("check-icon"),
            Box(Custom(loadingWheel() as Element as HTMLElement)).addClass("load-element", "loading")
        )
            .draw()
        );
    }
    onClick(action: (me: MouseEvent, pointer: Pointer<boolean>) => void) {
        this.wrapper.addEventListener('click', (me) => {
            if (this.color.getValue() == Color.Disabled) return;
            action(me, this.selected);
        });
        return this;
    }

    onPromiseClick(action: (me: MouseEvent, pointer: Pointer<boolean>) => Promise<void>) {
        this.onClick((me, p) => {
            if (this.loading.getValue()) return;
            this.loading.setValue(true);
            action(me, p)
                .finally(() => {
                    this.loading.setValue(false);
                });
        });
        return this;
    }

    setStyle(_style: Pointable<ButtonStyle>): this {
        throw new Error("Method not implemented.");
    }
}

export const Switch = (selected: Pointer<boolean>) => new SwitchComponent(selected);
