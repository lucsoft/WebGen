import { createElement, custom, span } from "../components/Components";
import { loadingWheel } from "../components/light-components/loadingWheel";
import { DialogActionAfterSubmit, DialogOptions, RenderComponent, RenderElement, RenderingXResult } from "../types/RenderingX";

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

    private checkIfOptionsIstRenderingXResult = (value: any): value is RenderingXResult<any> => {
        return typeof (value as any).getState !== "undefined";
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

            const renderedContent = options.content instanceof HTMLElement
                ? options.content
                : (this.checkIfOptionsIstRenderingXResult(options.content) ? options.content.getShell() : options.content.draw());

            renderedContent.classList.add('dialog-content')
            dialog.append(renderedContent)

            if (options.buttons) {
                const buttonList = createElement('buttonlist')

                options.buttons.forEach(([ language, action, color = 'normal' ]) => {
                    const button = custom('button', language, color)
                    button.onclick = async () => {
                        if (buttonList.classList.contains('loading')) return;
                        if (action === DialogActionAfterSubmit.Close)
                            closeDialog(false)
                        else if (action === DialogActionAfterSubmit.RemoveClose)
                            closeDialog()
                        else {
                            button.append(loadingWheel())
                            buttonList.classList.add('loading')
                            button.classList.add('loading')
                            const data = await action();
                            if (data !== undefined) closeDialog(data === DialogActionAfterSubmit.RemoveClose)
                            buttonList.classList.remove('loading')
                            button.classList.remove('loading')
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
                if (!this.checkIfOptionsIstCustomElement(options) && this.checkIfOptionsIstRenderingXResult(options.content))
                    options.content.forceRedraw()
                dialogBackdrop.classList.add('open')
                document.body.style.overflowY = "hidden";
            },
            close: closeDialog
        };
    }

    toBody = <DataT>(options: { maxWidth?: string }, initStateData: DataT, data: (redraw: ((stateData?: Partial<DataT>) => void)) => RenderComponent<DataT>[]): RenderingXResult<DataT> =>
        this.toCustom({ ...options, shell: document.body }, initStateData, data)

    toCustom<DataT>(options: { maxWidth?: string, shell?: HTMLElement }, initStateData: DataT, data: ((redraw: ((stateData?: Partial<DataT>) => void)) => RenderComponent<DataT>[]) | RenderComponent<DataT>[]): RenderingXResult<DataT> {
        const shell = createElement('article')
        let state = initStateData;
        options.shell?.append(shell)
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
            if (updateState !== undefined)
                state = { ...state, ...updateState };

            const data = drawedElements.find(([ findIndex ]) => findIndex == index)
            if (data) data[ 2 ] = true;
            drawFromCache()
        }

        function drawFromCache() {
            drawedElements.forEach(([ id, currentElement, requiresRerender ]) => {
                if (requiresRerender === false) return;

                const reDrawElement = fetchedData[ id ];
                const helpDraw = (data: HTMLElement | RenderElement) => data instanceof HTMLElement ? data : data.draw();
                const preRendered = typeof reDrawElement == "object"
                    ? reDrawElement
                    : reDrawElement(state, (updateState) => singleRedrawFunction(id, updateState))

                const mappedrender = helpDraw(preRendered);
                if (currentElement === undefined)
                    shell.append(mappedrender);
                else
                    shell.replaceChild(mappedrender, currentElement)
                drawedElements.find(([ oldId ]) => oldId == id)![ 1 ] = mappedrender;
                return mappedrender;
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
            getState: () => state,
            getShell: () => shell,
            forceRedraw: (data?: Partial<DataT>, index?: number) => {
                if (data !== undefined) {
                    state = { ...state, ...data } as any;
                }
                if (index) {
                    drawedElements.find(x => x[ 0 ] === index)![ 2 ] = true;
                    drawFromCache()
                }
                else
                    fullRedraw()
            }
        }
    }
}