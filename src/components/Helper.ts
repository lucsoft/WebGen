import { Component } from "../types.ts"

export const conditionalCSSClass = (element: HTMLElement, condition: boolean | undefined, className: string) =>
    element.classList[ condition === true ? "add" : "remove" ](className)

export const dropNullish = (...components: (Component | null | undefined)[]) => components.filter(x => x) as Component[];

export const changeClassAtIndex = (component: HTMLElement, newString: string, index: number) => component.classList.replace(component.classList[ index ], newString)