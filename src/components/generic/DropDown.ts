import { Color } from "../../lib/Color.ts";
import { ButtonStyle, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import '../../css/buttons.webgen.static.css';
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { changeClassAtIndex, conditionalCSSClass } from "../Helper.ts";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";
import { Custom } from "./Custom.ts";

type ButtonAction = {
    setProgress: (progress: number) => void
    setEnabled: (enable: boolean) => void
    changeState: (state: ButtonStyle) => void
};

/**
 * @deprecated this DropDown will be replace with a new one
 * @todo Cleanup Options
 */
export const DropDown = ({ state, text, pressOn, progress, color, href, dropdown, selectedOn, arrowDownIcon }: {
    state?: ButtonStyle,
    color?: Color,
    progress?: number,
    href?: string,
    dropdown?: ([ displayName: string, action: () => void ])[],
    text: string,
    pressOn?: (e: ButtonAction) => void,
    selectedOn?: () => void,
    arrowDownIcon?: string
}): Component => {
    const button = createElement("a");
    button.tabIndex = [ ButtonStyle.Spinner, ButtonStyle.Progress ].includes(state ?? ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled(color);
    button.classList.add("wbutton", color ?? Color.Grayscaled, state ?? ButtonStyle.Normal)
    if (href) button.href = href;
    const prog = createElement("div");
    button.append(loadingWheel());
    button.onkeydown = accessibilityButton(button)
    if (dropdown) {
        button.classList.add("isList")
        const list = createElement("ul")
        document.addEventListener('click', (e) => {
            if (!button.contains(e.target as Node)) {
                list.classList.remove('open');
            }

        })
        dropdown.forEach(([ displayName, action ]) => {
            const entry = createElement("a")
            entry.tabIndex = 0;
            entry.onkeydown = accessibilityButton(entry);
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
        changeClassAtIndex(button, state, 2);
        conditionalCSSClass(button, state === ButtonStyle.Spinner, "loading")
    }

    const setProgress = (progValue: number) => {
        if (progValue !== undefined)
            prog.style.width = `${progValue.toString()}%`;
    }
    if (state === ButtonStyle.Spinner) {
        button.classList.add("loading");
    }
    if (progress !== undefined && state === ButtonStyle.Progress) {
        prog.classList.add("progress");
        prog.style.width = `${progress.toString()}%`;
        button.append(prog);
    }
    button.append(text.toUpperCase());
    if (dropdown) {
        const iconContainer = createElement("div")
        iconContainer.classList.add("icon-suffix")
        iconContainer.append(Icon(arrowDownIcon ?? CommonIcon(CommonIconType.ArrowDown)).draw())
        button.append(iconContainer);
    }
    button.onclick = () => {
        if (button.classList.contains(Color.Disabled)) return;
        if (dropdown) button.querySelector('ul')?.classList.toggle("open");
        pressOn?.({ setProgress, setEnabled, changeState })
    };
    return Custom(button);
}
