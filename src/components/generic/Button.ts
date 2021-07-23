import { Color } from "../../lib/Color";
import { ButtonStyle, Component } from "../../types";
import { createElement, mIcon } from "../Components";
import '../../css/buttons.webgen.static.css';
import { loadingWheel } from "../light-components/loadingWheel";
import { conditionalCSSClass } from "../Helper";

export type ButtonAction = {
    setProgress: (progress: number) => void
    setEnabled: (enable: boolean) => void
    changeState: (state: ButtonStyle) => void
};
export const Button = ({ state, text, pressOn, progress, color, href, dropdown, selectedOn }: {
    state?: ButtonStyle,
    color?: Color,
    progress?: number,
    href?: string,
    dropdown?: ([ displayName: string, action: () => void ])[],
    text: string,
    pressOn?: (e: ButtonAction) => void,
    selectedOn?: () => void
}): Component => {
    let button = createElement("a") as HTMLAnchorElement;
    button.classList.add("wbutton", color ?? Color.Grayscaled, state ?? ButtonStyle.Normal)
    if (href) button.href = href;
    const prog = createElement("div");
    button.append(loadingWheel());

    if (dropdown) {
        const list = createElement("ul")
        document.addEventListener('click', (e) => {
            if (!button.contains(e.target as Node)) {
                list.classList.remove('open');
            }

        })
        dropdown.forEach(([ displayName, action ]) => {
            const entry = createElement("a")
            entry.innerText = displayName;
            entry.onclick = () => {
                action();
                selectedOn?.();
            };
            list.append(entry)
        })
        button.append(list)
    }
    const setEnabled = (enabled: boolean) => {
        if (enabled)
            button.classList.replace(Color.Disabled, color ?? Color.Grayscaled)
        else
            button.classList.replace(color ?? Color.Grayscaled, Color.Disabled)
    }

    const changeState = (state: ButtonStyle) => {
        button.classList.replace(button.classList[ 2 ], state)
        conditionalCSSClass(button, state === ButtonStyle.Spinner, "loading")
    }

    const setProgress = (progValue: number) => {
        if (progValue !== undefined)
            prog.style.width = progValue.toString() + "%";
    }
    if (state === ButtonStyle.Spinner) {
        button.classList.add("loading");
    }
    if (progress !== undefined && state === ButtonStyle.Progress) {
        prog.classList.add("progress");
        prog.style.width = progress.toString() + "%";
        button.append(prog);
    }
    button.append(text.toUpperCase());
    if (dropdown) {
        const iconContainer = createElement("div")
        iconContainer.classList.add("icon-suffix")
        iconContainer.append(mIcon("expand_more"))
        button.append(iconContainer);
    }
    button.onclick = () => {
        if (button.classList.contains(Color.Disabled)) return;
        if (dropdown) button.querySelector('ul')?.classList.toggle("open");
        pressOn?.({ setProgress, setEnabled, changeState })
    };
    return button;
}