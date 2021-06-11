export interface RenderElement {
    draw: () => HTMLElement
}

export type Component = HTMLElement | RenderElement