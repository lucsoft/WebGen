import { createElement, span } from "../components/Components";
import { RenderComponent } from "../types/RenderingX";

export class RenderingX {
    private staticNotify: HTMLElement;
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

    }

    notify(test: string, keepOpenUntilDone?: () => Promise<undefined>) {
        const notifcation = span(test)
        if (keepOpenUntilDone === undefined)
            setTimeout(() => notifcation.remove(), 6010);
        else keepOpenUntilDone().then(() => notifcation.remove())
        this.staticNotify.append(notifcation);
    }

    toBody = <DataT>(options: { maxWidth?: string }, initStateData: DataT | undefined, data: (redraw: (updateStateData?: DataT) => void) => RenderComponent<DataT>[]) =>
        this.toCustom({ ...options, shell: document.body }, initStateData, data)

    toCustom<DataT>(options: { maxWidth?: string, shell: HTMLElement }, initStateData: DataT | undefined, data: (redraw: (updateStateData?: DataT) => void) => RenderComponent<DataT>[]) {
        const shell = createElement('article')
        let state = initStateData;
        options.shell.append(shell)
        if (options.maxWidth) {
            shell.classList.add('maxWidth');
            shell.style.maxWidth = options.maxWidth;
        }

        let drawedElements: [ number, HTMLElement | undefined ][] = [];

        const fetchedData = data((updateState) => {
            if (updateState !== undefined) {
                state = { ...state, ...updateState };
                fullRedraw()
            }
            else
                drawFromCache()
        })
        function singleRedrawFunction(index: number, updateState: any) {
            if (updateState !== undefined) {
                state = { ...state, ...updateState };
            }
            const data = drawedElements.find(([ findIndex ]) => findIndex == index)
            if (data) data[ 1 ] = undefined;
            drawFromCache()
        }

        function drawFromCache() {
            shell.innerHTML = "";
            shell.append(...drawedElements.map(element => {
                if (element[ 1 ] != undefined)
                    return element[ 1 ];
                const reDrawElement = fetchedData[ element[ 0 ] ];
                const preRendered = typeof reDrawElement == "object"
                    ? reDrawElement.draw()
                    : reDrawElement((updateState) => singleRedrawFunction(element[ 0 ], updateState), state as any).draw()
                drawedElements.find(x => x[ 0 ] == element[ 0 ])![ 1 ] = preRendered;
                return preRendered;
            }));
        }

        function fullRedraw() {
            drawedElements = [];
            drawedElements = fetchedData.map((x, index) => [
                index,
                typeof x == "object"
                    ? x.draw()
                    : x((updateState) => singleRedrawFunction(index, updateState), state as any).draw()
            ])
            drawFromCache()
        }
        fullRedraw()

        return {
            getState: () => initStateData,
            redraw: (data?: Partial<DataT>) => {
                if (data !== undefined) {
                    state = { ...state, ...data } as any;
                }
                fullRedraw()
            }
        }
    }
}