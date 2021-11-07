import { custom } from "../components/Components";
import { Button } from "../components/generic/Button";
import { Horizontal, Spacer } from "../components/generic/Stacks";
import { PlainText } from "../components/generic/PlainText";
import '../css/dialog.webgen.static.css';
import { ButtonStyle, ViewOptions, ViewOptionsFunc } from "../types";
import { Color } from "./Color";
import { View, ViewData } from "./View";

type DialogeFinal = void | undefined | 'close' | 'remove';

type DialogButtonAction = ((() => DialogeFinal) | (() => Promise<DialogeFinal>) | 'close' | 'remove');

export type DialogButton = {
    label: string,
    action: DialogButtonAction,
    color: Color,
    style?: ButtonStyle.Inline | ButtonStyle.Normal | ButtonStyle.Secondary
}

const dialogShell = custom('div', undefined, 'dialog-shell');
document.body.append(dialogShell);

export type DialogData = {
    addButton: (label: string, action: DialogButtonAction, style?: DialogButton[ "color" ], state?: DialogButton[ "style" ]) => DialogData
    setTitle: (text: string) => DialogData
    allowUserClose: () => DialogData
    addClass: (...classes: string[]) => DialogData
    onClose: (action: () => void) => DialogData
    close: () => DialogData
    open: () => DialogData
    remove: () => void,
    unsafeViewOptions: <TypeT>() => ViewOptions<TypeT>
}

export function Dialog<State>(render: ViewOptionsFunc<State>): DialogData {

    const dialogBackdrop = custom('div', undefined, 'dialog-backdrop')
    dialogShell.append(dialogBackdrop)
    let isLoading = false;
    let onCloseAction: null | (() => void) = null;
    let title: string | null = null;
    let firstRun = true;
    let allowUserClose = false;
    const dialog = custom('div', undefined, 'dialog')
    let view: ViewData = View(render)
        .addClass('dialog-content')
        .appendOn(dialog);

    document.addEventListener('keyup', closeDialogFromKeyboard)
    dialogBackdrop.addEventListener('click', closeDialogFromBackdrop)

    const buttons: DialogButton[] = [];

    const settings = {
        addButton: (label: string, action: DialogButtonAction, color: DialogButton[ "color" ] = Color.Grayscaled, state: DialogButton[ "style" ]) => {
            buttons.push({ label, action, color, style: state })
            return settings;
        },
        addClass: (...classes: string[]) => { dialog.classList.add(...classes); return settings; },
        setTitle: (text: string) => { title = text; return settings; },
        allowUserClose: () => {
            allowUserClose = true;
            return settings;
        },
        onClose: (action: () => void) => {
            onCloseAction = action;
            return settings;
        },
        remove: () => {
            document.removeEventListener('keyup', closeDialogFromKeyboard)
            dialogBackdrop.removeEventListener('click', closeDialogFromBackdrop)
            dialogBackdrop.remove()
        },
        close: () => {
            dialogBackdrop.classList.remove('open')
            document.body.style.overflowY = "unset";
            onCloseAction?.();
            return settings;
        },
        unsafeViewOptions: <State>() => view.unsafeViewOptions<State>(),
        open: () => {
            if (firstRun) {
                if (title) dialog.prepend(PlainText(title).addClass('dialog-title').draw())
                if (buttons.length > 0) {
                    dialog.append(Horizontal(Spacer(), ...buttons.map(({ action, color, label, style }, i) => Button(label)
                        .setStyle(style ?? (buttons.length - 1 == i ? ButtonStyle.Normal : ButtonStyle.Inline))
                        .setColor(color)
                        .onClick(async ({ changeState }) => {
                            if (isLoading) return;
                            isLoading = true;
                            if (action === 'close')
                                settings.close()
                            else if (action === 'remove')
                                settings.close().remove()
                            else {
                                changeState(ButtonStyle.Spinner);
                                const data = await action();
                                if (data !== undefined) settings.close()
                                if (data === "remove") settings.remove()

                                changeState(style ?? (buttons.length - 1 == i ? ButtonStyle.Normal : ButtonStyle.Inline));
                            }
                            isLoading = false;

                        }))).setMargin("0.7rem").setGap("0.5rem").draw());
                }
                firstRun = false;
                dialogBackdrop.append(dialog);
            }
            dialogBackdrop.classList.add('open')
            document.body.style.overflowY = "hidden";
            return settings;
        }
    }
    return settings;

    function closeDialogFromBackdrop(e: MouseEvent) {
        if (!allowUserClose)
            return;
        if (e.target != dialogBackdrop || isLoading)
            return;
        settings.close();
    }

    function closeDialogFromKeyboard(e: KeyboardEvent) {
        if (!allowUserClose)
            return;
        if (e.key == "Escape" && dialogBackdrop.classList.contains('open') && !isLoading)
            settings.close();
    }
}