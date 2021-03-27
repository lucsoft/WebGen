export interface RenderElement {
    draw: () => HTMLElement
}
export const enum DialogActionAfterSubmit {
    Close,
    RemoveClose
}
export type RenderingXResult<StateDataT> = {
    getState: () => StateDataT,
    getShell: () => HTMLElement,
    forceRedraw: (data?: Partial<StateDataT>, index?: number) => void
};
export type DialogButtonAcction = [
    label: string,
    action: (
        (() => undefined | DialogActionAfterSubmit)
        | (() => Promise<undefined | DialogActionAfterSubmit>)
        | DialogActionAfterSubmit
    ),
    color?: 'normal' | 'red'
]
export type DialogOptions = {
    title?: string | HTMLElement,
    content: RenderingXResult<any> | RenderElement | HTMLElement,
    buttons?: DialogButtonAcction[]
};
export type RenderComponent<DataT> = HTMLElement | RenderElement | ((singleRedraw: (updateStateData?: Partial<DataT>) => void, state: DataT) => HTMLElement | RenderElement);