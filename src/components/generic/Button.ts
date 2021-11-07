import { Color } from "../../lib/Color";
import { ButtonStyle } from "../../types";
import { createElement } from "../Components";
import '../../css/buttons.webgen.static.css';
import { loadingWheel } from "../light-components/loadingWheel";
import { changeClassAtIndex, conditionalCSSClass, dropNullish } from "../Helper";
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility";

export type ButtonAction = {
    setProgress: (progress: number) => void
    setEnabled: (enable: boolean) => void
    changeState: (state: ButtonStyle) => void
};
const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];
const enableTuple = (enabled: boolean, color = Color.Grayscaled) => [ Color.Disabled, color ][ enabled ? "values" : "reverse" ]() as [ Color, Color ];

export const Button = (text: string) => {
    let button = createElement("a");
    button.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
    button.classList.add("wbutton", Color.Grayscaled, ButtonStyle.Normal)
    const prog = createElement("div");
    button.append(loadingWheel());
    button.onkeydown = accessibilityButton(button)

    let setEnabled = (enabled: boolean) => button.classList.replace(...enableTuple(enabled))
    const changeState = (state: ButtonStyle) => {
        changeClassAtIndex(button, state, 2);
        conditionalCSSClass(button, state === ButtonStyle.Spinner, "loading")
    }

    const setProgress = (progValue: number) => {
        if (progValue !== undefined)
            prog.style.width = `${progValue.toString()}%`;
    }
    button.append(text.toUpperCase());
    let pressOn: (e: ButtonAction) => void = () => { };
    button.onclick = () => {
        if (button.classList.contains(Color.Disabled)) return;
        pressOn({ setProgress, setEnabled, changeState })
    };
    const settings = {
        draw: () => button,
        onClick: (action: ((e: ButtonAction) => void) | string) => {
            if (typeof action == "string") button.href = action;
            else pressOn = action;
            return settings;
        },
        setStyle: (style: ButtonStyle, progress?: number) => {
            button.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
            changeClassAtIndex(button, style, 2);
            if (style === ButtonStyle.Spinner) {
                button.classList.add("loading");
            }
            if (progress !== undefined && style === ButtonStyle.Progress) {
                prog.classList.add("progress");
                prog.style.width = `${progress.toString()}%`;
                button.append(prog);
            }
            return settings;
        },
        addClass: (...classes: string[]) => {
            button.classList.add(...classes);
            return settings;
        },
        setColor: (color: Color) => {
            setEnabled = (enabled: boolean) => button.classList.replace(...enableTuple(enabled, color))
            button.tabIndex = speicalSyles.includes(button.classList[ 3 ] as ButtonStyle) ? -1 : accessibilityDisableTabOnDisabled(color);
            changeClassAtIndex(button, color, 1);
            return settings;
        }
    };
    return settings;
}
