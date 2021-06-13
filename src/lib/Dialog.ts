import { createElement, custom, span } from "../components/Components";
import { loadingWheel } from "../components/light-components/loadingWheel";
import '../css/dialog.webgen.static.css';
import { ViewOptions } from "../types/ViewOptions";
import { View } from "./View";

type DialogButtonAction = ((() => undefined | 'close') | (() => Promise<undefined | 'close'>) | 'close');

export type DialogButton = {
    label: string,
    action: DialogButtonAction,
    style: 'flat' | 'red'
}

const dialogShell = custom('div', undefined, 'dialog-shell');
document.body.append(dialogShell);

export function Dialog<State>(render: ViewOptions<State>) {

    const dialogBackdrop = custom('div', undefined, 'dialog-backdrop')
    dialogShell.append(dialogBackdrop)
    let isLoading = false;
    let onCloseAction: null | (() => void) = null;
    let title: string | null = null;
    const buttons: DialogButton[] = [];

    const settings = {
        addButton: (label: string, action: DialogButtonAction, style: DialogButton[ "style" ] = "flat") => {
            buttons.push({ label, action, style })
            return settings;
        },
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
            if (title) dialog.append(span(title, 'dialog-title'))
            View(render)
                .addClass('dialog-content')
                .appendOn(dialog)
            if (buttons.length > 0) {
                const buttonList = createElement('buttonlist')
                buttons.forEach(({ action, label, style }) => {
                    const button = custom('button', label, style)
                    button.onclick = async () => {
                        if (buttonList.classList.contains('loading')) return;
                        if (action === 'close')
                            settings.close()
                        else {
                            button.append(loadingWheel())
                            buttonList.classList.add('loading')
                            button.classList.add('loading')
                            const data = await action();
                            isLoading = true;
                            if (data !== undefined) settings.close()
                            buttonList.classList.remove('loading')
                            button.classList.remove('loading')
                            isLoading = false;
                        }
                    }
                    buttonList.append(button);
                })
                dialog.append(buttonList);
            }
            dialogBackdrop.append(dialog);
            dialogBackdrop.classList.add('open')
            document.body.style.overflowY = "hidden";
        }
    }
    return settings;
}