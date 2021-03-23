import { ButtonActions } from "../types/actions";
import { conditionalCSSClass } from "./Helper";

export const createElement = (type: string) => window.document.createElement(type);

export function action(element: HTMLElement, type: string, value: unknown) {
    element.dispatchEvent(new CustomEvent(type, { detail: value }))
}

/**
 * # Actions
 * @checked (boolean)
 * @disable (boolean)
 */
export function switchButtons(options: {
    disabled?: boolean;
    checked?: boolean;
    onClick?: (active: boolean) => void;
    onAnimationComplete?: (active: boolean) => void;
}) {
    const span = createElement('span');

    const switchE = createElement('switch');
    const input = createElement('input') as HTMLInputElement;

    input.classList.add("hide");
    input.type = "checkbox";
    span.addEventListener("disabled", (action) => {
        const checkThing = (action as CustomEvent).detail;
        conditionalCSSClass(switchE, checkThing, 'disabled')
        input.disabled = checkThing;
    })
    span.addEventListener("checked", (action) => {
        const checkThing = (action as CustomEvent).detail;
        conditionalCSSClass(switchE, checkThing, 'active')
        input.checked = checkThing;
    })

    span.dispatchEvent(new CustomEvent("disabled", { detail: options.disabled }))
    span.dispatchEvent(new CustomEvent("checked", { detail: options.checked }))

    span.onclick = () => {
        if (input.disabled)
            return;
        switchE.classList.toggle("active");
        input.checked = !input.checked;
        options.onClick?.(input.checked);
        setTimeout(() => options.onAnimationComplete?.(input.checked), 500);
    }
    span.append(switchE);
    span.append(input);
    return span;
}

export const span = (message: undefined | string | HTMLElement, ...classList: string[]): HTMLElement => custom('span', message, ...classList)
export const mIcon = (icon: string, ...classList: string[]) => custom("span", icon, "material-icons-round", "webgen-icon", ...classList);
export const img = (source: string | undefined, ...classList: string[]) => {
    const img = createElement('img') as HTMLImageElement
    img.classList.add(...classList)
    if (source) img.src = source;
    return img;
};
export function custom(type: string, message: undefined | string | HTMLElement, ...classList: string[]): HTMLElement {
    const span = createElement(type);
    span.classList.add(...classList)

    if (typeof message == "string")
        span.innerText = message;
    else if (message != undefined)
        span.append(message);
    return span;
}
/**
 * # Actions
 * @value (number)
 * @disable (boolean)
 */
export function dropdown(options: { default: number; disable?: boolean; small?: boolean; } = { default: 0 }, ...entrys: { title: string, action: () => void }[]): HTMLElement {
    const input = createElement('drop-down');
    const title = createElement('span');
    title.innerText = entrys[ options.default ].title ?? 'Unkown';
    const ul = createElement('ul');
    ul.tabIndex = 0;
    title.onclick = () => {
        input.classList.add('open');
        ul.focus();
    };
    ul.onblur = () => {
        input.classList.remove('open');
    }
    if (options.small)
        input.classList.add('small')
    input.addEventListener("disabled", (action) => {
        conditionalCSSClass(input, (action as CustomEvent).detail, 'disabled')
    })
    input.addEventListener("value", (action) => {
        if ((action as CustomEvent).detail !== undefined)
            title.innerText = entrys[ (action as CustomEvent).detail ].title ?? 'Unkown';
    })

    input.dispatchEvent(new CustomEvent("disabled", { detail: options.disable }))
    input.dispatchEvent(new CustomEvent("value", { detail: options.default }))

    entrys.forEach(element => {
        const li = createElement('li');
        li.innerText = element.title;
        li.onclick = () => {
            input.classList.remove('open');
            title.innerText = element.title;
            element.action();
        }
        ul.append(li);
    });
    input.append(title, ul);
    return input;
}

export function input(options: { type?: string, placeholder?: string, value?: string, width?: string }) {
    const input = createElement('input') as HTMLInputElement;
    input.classList.add('tiny-input', 'ignore-default');
    if (options.type)
        input.type = options.type;
    if (options.width)
        input.style.width = options.width;
    if (options.value)
        input.value = options.value;
    if (options.placeholder)
        input.placeholder = options.placeholder;
    return input;
}

/**
 * #Actions
 *  @value (list)
 */
export function list(options: { margin?: boolean; style?: "none" | "default"; noHeigthLimit?: boolean }, ...listRaw: { left: string | HTMLElement; right?: HTMLElement; click?: () => void; actions?: { type: string, click: () => void }[] }[]) {
    const listE = createElement('list');

    if (!options.margin)
        listE.classList.add('nomargin')

    if (options.style !== "none")
        listE.classList.add('style2')

    if (options.noHeigthLimit)
        listE.classList.add('noHeigthLimit')
    listE.addEventListener("value", (action) => {

        listE.innerHTML = "";
        for (const iterator of (action as CustomEvent).detail) {
            const item = createElement('item');
            if (iterator.click)
                item.onclick = iterator.click;
            const left = createElement('span');
            if (typeof iterator.left === "string") {
                left.classList.add('left');
                left.innerText = iterator.left;
            } else
                left.append(iterator.left)
            item.append(left);
            if (iterator.right !== undefined || (iterator.actions !== undefined && iterator.actions.length !== 0)) {
                const right = createElement('span');
                right.classList.add('right');

                if (iterator.right) {
                    if (iterator.actions && iterator.actions.length > 0)
                        iterator.right.classList.add('always');
                    right.append(iterator.right)
                }

                if (iterator.actions)
                    for (const action of iterator.actions) {
                        const act = mIcon(action.type);
                        act.onclick = action.click;
                        right.append(act);
                    }

                item.append(right);
            }
            listE.append(item);
        }
    })
    listE.dispatchEvent(new CustomEvent("value", { detail: listRaw }))

    return listE;
}

export function multiStateSwitch(style: "normal" | "small", ...test: ButtonActions[]) {
    const tinymenu = createElement('div');
    tinymenu.classList.add('tinymenu', style)
    for (const iterator of test) {
        const button = custom('button', iterator.title);
        button.onclick = iterator.action;
        tinymenu.append(button);
    }
    return tinymenu;
}