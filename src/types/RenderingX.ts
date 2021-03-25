export interface RenderElement {
    draw: () => HTMLElement
}
export const enum DialogActionAfterSubmit {
    Close,
    RemoveClose
}
export type DialogButtonAcction = [
    label: string,
    action: (
        (() => undefined | DialogActionAfterSubmit)
        | (() => Promise<undefined | DialogActionAfterSubmit>)
        | DialogActionAfterSubmit
    ),
    color?: 'normal' | 'red'
]
export type DialogOptions = { title?: string | HTMLElement, content: RenderElement | HTMLElement, buttons?: DialogButtonAcction[] };
export type RenderComponent<DataT> = RenderElement | ((singleRedraw: (updateStateData?: Partial<DataT>) => void, state: DataT) => RenderElement);