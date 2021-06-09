export interface RenderElement {
    draw: () => HTMLElement
}

export type RenderingXResult<StateDataT> = {
    getState: () => StateDataT,
    getShell: () => HTMLElement,
    forceRedraw: (data?: Partial<StateDataT>, index?: number) => void
};
export type DialogButtonAction = [
    label: string,
    action: (
        (() => undefined | true)
        | (() => Promise<undefined | true>)
        | true
    ),
    color?: 'normal' | 'red'
]

export type Component = HTMLElement | RenderElement
export type RenderComponent<DataT> =
    HTMLElement
    | RenderElement
    | ((state: DataT, singleRedraw: (updateStateData?: Partial<DataT>) => void) =>
        HTMLElement
        | RenderElement
    );