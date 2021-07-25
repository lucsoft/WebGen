import { Color } from "../../lib/Color";
import { Component } from "../../types";
import { createElement } from "../Components";
import '../../css/buttons.webgen.static.css';
import { loadingWheel } from "../light-components/loadingWheel";
import { conditionalCSSClass } from "../Helper";

export const enum ButtonState {
    Inline = "inline",
    Normal = "normal",
    Secondary = "secondary",
    Spinner = "spinner",
    Progress = "progress"
}

export type ButtonAction = {
    setProgress: (progress: number) => void
    setEnabled: (enable: boolean) => void
    changeState: (state: ButtonState) => void
};
export const Button = ({ state, text, pressOn, progress, style, href }: {
    state?: ButtonState,
    style?: Color,
    progress?: number,
    href?: string,
    text: string, pressOn?: (e: ButtonAction) => void
}): Component => {
    let button = createElement("a") as HTMLAnchorElement;
    button.classList.add("wbutton", style ?? Color.Grayscaled, state ?? ButtonState.Normal)
    if (href) button.href = href;
    const prog = createElement("div");
    button.append(loadingWheel());

    const setEnabled = (enabled: boolean) => {
        if (enabled)
            button.classList.replace(Color.Disabled, style ?? Color.Grayscaled)
        else
            button.classList.replace(style ?? Color.Grayscaled, Color.Disabled)
    }

    const changeState = (state: ButtonState) => {
        button.classList.replace(button.classList[ 2 ], state)
        conditionalCSSClass(button, state === ButtonState.Spinner, "loading")
    }

    const setProgress = (progValue: number) => {
        if (progValue !== undefined)
            prog.style.width = progValue.toString() + "%";
    }
    if (state === ButtonState.Spinner) {
        button.classList.add("loading");
    }
    if (progress !== undefined && state === ButtonState.Progress) {
        prog.classList.add("progress");
        prog.style.width = progress.toString() + "%";
        button.append(prog);
    }
    button.append(text.toUpperCase());
    button.onclick = () => pressOn?.({ setProgress, setEnabled, changeState });
    return button;
}