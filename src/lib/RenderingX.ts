import { createElement, span } from "../components/Components";
import { RenderComponent, RenderElement, RenderingXResult } from "../types/RenderingX";
import '../css/cards.webgen.static.css';
import '../css/dialog.webgen.static.css';

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