import { createElement, custom, span } from "../components/Components";
import { loadingWheel } from "../components/light-components/loadingWheel";
import { DialogActionAfterSubmit, DialogOptions, RenderComponent, RenderElement } from "../types/RenderingX";

export class RenderingX {
    private staticNotify: HTMLElement;
    private dialogShell: HTMLElement;
    constructor() {
        const notify: HTMLElement | null = document.querySelector('#notify');
        if (notify)
            this.staticNotify = notify;
        else {
            const notifyNew = createElement('div');
            notifyNew.id = "notify";
            notifyNew.classList.add('notify');
            document.body.append(notifyNew);
            this.staticNotify = notifyNew;
        }

        this.dialogShell = createElement('div');
        this.dialogShell.classList.add('dialog-shell');
        document.body.append(this.dialogShell)
    }

    notify(test: string, keepOpenUntilDone?: () => Promise<undefined>) {
        const notifcation = span(test)
        if (keepOpenUntilDone === undefined)
            setTimeout(() => notifcation.remove(), 6010);
        else keepOpenUntilDone().then(() => notifcation.remove())
        this.staticNotify.append(notifcation);
    }

    private checkIfOptionsIstCustomElement = (value: any): value is { customElement: HTMLElement } => {
        return typeof (value as any).customElement !== "undefined";
    }

    toDialog(options: DialogOptions | { customElement: HTMLElement }) {

        const dialogBackdrop = custom('div', undefined, 'dialog-backdrop')
        const closeDialog = (autoRemove = true) => {
            dialogBackdrop.classList.remove('open')
            document.body.style.overflowY = "unset";
            if (autoRemove) dialogBackdrop.remove()
        };

        if (this.checkIfOptionsIstCustomElement(options)) {
            options.customElement.classList.add('dialog')
            dialogBackdrop.append(options.customElement);
        } else {
            const dialog = createElement('div')

            dialog.classList.add('dialog')
            dialogBackdrop.append(dialog);
            if (options.title) dialog.append(span(options.title, 'dialog-title'))

            const renderedContent = options.content instanceof HTMLElement ? options.content : options.content.draw();

            renderedContent.classList.add('dialog-content')
            dialog.append(renderedContent)

            if (options.buttons) {
                const buttonList = createElement('buttonlist')

                options.buttons.forEach(([ language, action, color = 'normal' ]) => {
                    const button = custom('button', language, color)
                    button.onclick = () => {
                        if (buttonList.classList.contains('loading')) return;
                        if (action === DialogActionAfterSubmit.Close)
                            closeDialog(false)
                        else if (action === DialogActionAfterSubmit.RemoveClose)
                            closeDialog()
                        else {
                            const exec = action()
                            button.append(loadingWheel())
                            if (exec instanceof Promise) {
                                buttonList.classList.add('loading')
                                button.classList.add('loading')
                                exec.then((onSubmit) => {
                                    if (onSubmit) closeDialog(onSubmit === DialogActionAfterSubmit.RemoveClose)
                                    buttonList.classList.remove('loading')
                                    button.classList.remove('loading')
                                })
                            } else if (exec)
                                closeDialog(exec === DialogActionAfterSubmit.RemoveClose)

                        }
                    }
                    buttonList.append(button);
                })
                dialog.append(buttonList)
            }
        }

        this.dialogShell.append(dialogBackdrop)
        return {
            open: () => {
                dialogBackdrop.classList.add('open')
                document.body.style.overflowY = "hidden";
            },
            close: closeDialog
        };
    }

    toBody = <DataT>(options: { maxWidth?: string }, initStateData: DataT | undefined, data: (redraw: (updateStateData?: DataT) => void) => RenderComponent<DataT>[]) =>
        this.toCustom({ ...options, shell: document.body }, initStateData, data)

    toCustom<DataT>(options: { maxWidth?: string, shell: HTMLElement }, initStateData: DataT | undefined, data: ((redraw: (updateStateData?: DataT) => void) => RenderComponent<DataT>[]) | RenderComponent<DataT>[]) {
        const shell = createElement('article')
        let state = initStateData;
        options.shell.append(shell)
        if (options.maxWidth) {
            shell.classList.add('maxWidth');
            shell.style.maxWidth = options.maxWidth;
        }

        let drawedElements: [ number, HTMLElement, boolean | undefined ][] = [];

        const fetchedData = typeof data === "function" ? data((updateState) => {
            if (updateState !== undefined) {
                state = { ...state, ...updateState };
                fullRedraw()
            }
            else drawFromCache()
        }) : data;
        function singleRedrawFunction(index: number, updateState: any) {
            if (updateState !== undefined) {
                state = { ...state, ...updateState };
            }
            const data = drawedElements.find(([ findIndex ]) => findIndex == index)
            if (data) data[ 2 ] = true;
            drawFromCache()
        }

        function drawFromCache() {
            drawedElements.forEach(([ id, currentElement, requiresRerender ]) => {
                if (requiresRerender === false) return;

                const reDrawElement = fetchedData[ id ];
                const preRendered = typeof reDrawElement == "object"
                    ? reDrawElement.draw()
                    : reDrawElement((updateState) => singleRedrawFunction(id, updateState), state as any).draw()

                if (currentElement === undefined)
                    shell.append(preRendered);
                else
                    shell.replaceChild(preRendered, currentElement)
                drawedElements.find(([ oldId ]) => oldId == id)![ 1 ] = preRendered;
                return preRendered;
            })
        }

        function fullRedraw() {
            drawedElements = fetchedData.map((_, index) => [
                index, drawedElements[ index ]?.[ 1 ], true
            ])
            drawFromCache()
        }
        fullRedraw()

        return {
            getState: () => initStateData,
            indexRedraw: (index: number, data?: Partial<DataT>) => {
                if (data !== undefined) {
                    state = { ...state, ...data } as any;
                }
                drawedElements.find(x => x[ 0 ] === index)![ 2 ] = true;
                drawFromCache()
            },
            forceRedraw: (data?: Partial<DataT>) => {
                if (data !== undefined) {
                    state = { ...state, ...data } as any;
                }
                fullRedraw()
            }
        }
    }
}