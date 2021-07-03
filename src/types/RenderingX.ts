/**
 * @deprecated Please use Component
 */
export interface RenderElement {
    draw: () => HTMLElement
}

export type Component = HTMLElement | RenderElement