import { createElement, custom, draw, span } from "../components/Components";
import { Button } from "../components/generic/Button";
import { Horizontal } from "../components/generic/Stacks";
import { loadingWheel } from "../components/light-components/loadingWheel";
import '../css/dialog.webgen.static.css';
import { ButtonStyle } from "../types";
import { ViewOptions } from "../types/ViewOptions";
import { Color } from "./Color";
import { View } from "./View";

type DialogButtonAction = ((() => undefined | 'close') | (() => Promise<undefined | 'close'>) | 'close');

export type DialogButton = {
    label: string,
    action: DialogButtonAction,
    color: Color,
    state?: ButtonStyle.Inline | ButtonStyle.Normal | ButtonStyle.Secondary
}

const dialogShell = custom('div', undefined, 'dialog-shell');
document.body.append(dialogShell);

export type DialogData = {
    addButton: (label: string, action: DialogButtonAction, style?: DialogButton[ "color" ], state?: DialogButton[ "state" ]) => DialogData
    setTitle: (text: string) => DialogData
    allowUserClose: () => DialogData
    addClass: (...classes: string[]) => DialogButton
    onClose: (action: () => void) => DialogData
    close: () => DialogData
    open: () => DialogData
}

export function Dialog<State>(render: ViewOptions<State>): DialogData {

    const dialogBackdrop = custom('div', undefined, 'dialog-backdrop')
    dialogShell.append(dialogBackdrop)
    let isLoading = false;
    let cssClasses: string[] = [];
    let onCloseAction: null | (() => void) = null;
    let title: string | null = null;
    const buttons: DialogButton[] = [];

    const settings = {
        addButton: (label: string, action: DialogButtonAction, color: DialogButton[ "color" ] = Color.Grayscaled, state: DialogButton[ "state" ]) => {
            buttons.push({ label, action, color, state })
            return settings;
        },
        /**
         * Notice: This addClass is not Hot Update (View is). Dialog needs a reopen to update.
         * CSS Classes gets applied to the Dialog not the Content
        */
        addClass: (...classes: string[]) => { cssClasses.push(...classes); return settings; },
        setTitle: (text: string) => { title = text; return settings; },
        allowUserClose: () => {
            document.addEventListener('keyup', (e) => {
                if (e.key == "Escape" && dialogBackdrop.classList.contains('open') && !isLoading) settings.close()
            }, { once: true })
            dialogBackdrop.addEventListener('click', (e) => {
                if (e.target != dialogBackdrop || isLoading) return;
                settings.close()
            }, { once: true })
            return settings;
        },
        onClose: (action: () => void) => {
            onCloseAction = action;
            return settings;
        },
        close: () => {
            dialogBackdrop.classList.remove('open')
            document.body.style.overflowY = "unset";
            dialogBackdrop.remove()
            onCloseAction?.();
            return settings;
        },
        open: () => {
            const dialog = custom('div', undefined, 'dialog')
            dialog.classList.add(...cssClasses);
            if (title) dialog.append(span(title, 'dialog-title'))
            View(render)
                .addClass('dialog-content')
                .appendOn(dialog)
            if (buttons.length > 0) {
                const list = Horizontal({ align: 'flex-end', margin: "0.7rem", gap: "0.5rem" }, ...buttons.map(({ action, color, label, state }, i) => Button({
                    text: label,
                    state: state ?? (buttons.length - 1 == i ? ButtonStyle.Normal : ButtonStyle.Inline),
                    color,
                    pressOn: async ({ changeState }) => {
                        if (action === 'close')
                            settings.close()
                        else {
                            changeState(ButtonStyle.Spinner);
                            const data = await action();
                            if (data !== undefined) settings.close()
                            changeState(state ?? (buttons.length - 1 == i ? ButtonStyle.Normal : ButtonStyle.Inline));
                        }
                    }
                })))

                dialog.append(draw(list));
            }
            dialogBackdrop.append(dialog);
            dialogBackdrop.classList.add('open')
            document.body.style.overflowY = "hidden";
            return settings;
        }
    }
    return settings;
}