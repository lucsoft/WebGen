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
export type DialogButtonAction = [
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
    userRequestClose?: () => DialogActionAfterSubmit | undefined,
    content: RenderingXResult<any> | RenderElement | HTMLElement,
    buttons?: DialogButtonAction[]
};
export type RenderComponent<DataT> =
    HTMLElement
    | RenderElement
    | ((state: DataT, singleRedraw: (updateStateData?: Partial<DataT>) => void) =>
        HTMLElement
        | RenderElement
    );