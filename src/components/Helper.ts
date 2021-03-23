export const conditionalCSSClass = (element: HTMLElement, condition: boolean | undefined, className: string) => {
    if (condition === true)
        element.classList.add(className)
    else
        element.classList.remove(className)
}