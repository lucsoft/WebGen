import { Component } from "../types"

export const conditionalCSSClass = (element: HTMLElement, condition: boolean | undefined, className: string) => {
    if (condition === true)
        element.classList.add(className)
    else
        element.classList.remove(className)
}

export const nullish = (...components: (Component | null | undefined)[]) => components.filter(x => x) as Component[];