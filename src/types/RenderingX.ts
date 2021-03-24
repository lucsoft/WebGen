export interface RenderElement {
    draw: () => HTMLElement
}
export type RenderComponent<DataT> = RenderElement | ((singleRedraw: (updateStateData?: Partial<DataT>) => void, state: DataT) => RenderElement);