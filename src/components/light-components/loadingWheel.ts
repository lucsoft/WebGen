export const loadingWheel = () => {
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.classList.add('loading-wheel')
    icon.setAttribute("viewBox", "0 0 73 73")
    icon.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    icon.setAttribute("fill", "none");
    icon.innerHTML = `<circle cx="36.5" cy="36.5" r="35.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    return icon;
}