export function cardProgress(id: string)
{
    const cardprogress = document.createElement("span");
    const pro = document.createElement("span");
    pro.classList.add("pro")
    pro.id = id;
    cardprogress.classList.add("cardprogress");
    cardprogress.append(pro);
    return cardprogress;
}

export function format(text: string)
{
    const formt = document.createElement("span");
    formt.classList.add('text');
    formt.innerHTML = text;
    return formt;
}

export function action(element: HTMLElement, type: string, value: unknown)
{
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
})
{
    const span = document.createElement('span');

    const switchE = document.createElement('switch');
    const input = document.createElement('input');

    input.classList.add("hide");
    input.type = "checkbox";
    span.addEventListener("disabled", (action) =>
    {
        if ((action as CustomEvent).detail === true)
        {
            switchE.classList.add('disabled');
            input.disabled = true;
        } else
        {
            switchE.classList.remove('disabled');
            input.disabled = false;
        }
    })
    span.addEventListener("checked", (action) =>
    {
        if ((action as CustomEvent).detail === true)
        {
            input.checked = true;
            switchE.classList.add("active");
        } else
        {
            input.checked = false;
            switchE.classList.remove("active");
        }
    })

    span.dispatchEvent(new CustomEvent("disabled", { detail: options.disabled }))
    span.dispatchEvent(new CustomEvent("checked", { detail: options.checked }))

    span.onclick = () =>
    {
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

export function span(message: string | HTMLElement): HTMLElement
{
    const span = document.createElement('span');
    if (typeof message == "string")
        span.innerText = message;
    else
        span.append(message);
    return span;
}

/**
 * # Actions
 * @value (number)
 * @disable (boolean)
 */
export function dropdown(options: { default: number; disable?: boolean; small?: boolean; } = { default: 0 }, ...entrys: { title: string, action: () => void }[]): HTMLElement
{
    const input = document.createElement('drop-down');
    const title = document.createElement('span');
    title.innerText = entrys[ options.default ].title ?? 'Unkown';
    const ul = document.createElement('ul');
    ul.tabIndex = 0;
    title.onclick = () =>
    {
        input.classList.add('open');
        ul.focus();
    };
    ul.onblur = () =>
    {
        input.classList.remove('open');
    }
    if (options.small)
        input.classList.add('small')
    input.addEventListener("disabled", (action) =>
    {
        if ((action as CustomEvent).detail === true)
            input.classList.add('disabled');
        else ((action as CustomEvent).detail === true)
        input.classList.remove('disabled');

    })
    input.addEventListener("value", (action) =>
    {
        if ((action as CustomEvent).detail !== undefined)
            title.innerText = entrys[ (action as CustomEvent).detail ].title ?? 'Unkown';
    })

    input.dispatchEvent(new CustomEvent("disabled", { detail: options.disable }))
    input.dispatchEvent(new CustomEvent("value", { detail: options.default }))

    entrys.forEach(element =>
    {
        const li = document.createElement('li');
        li.innerText = element.title;
        li.onclick = () =>
        {
            input.classList.remove('open');
            title.innerText = element.title;
            element.action();
        }
        ul.append(li);
    });
    input.append(title, ul);
    return input;
}

export function input(options: { type?: string, placeholder?: string, value?: string, width?: string })
{
    const input = document.createElement('input');
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
export function list(options: { margin?: boolean; style?: "none" | "default"; noHeigthLimit?: boolean }, ...listRaw: { left: string | HTMLElement; right?: HTMLElement; click?: () => void; actions?: { type: string, click: () => void }[] }[])
{
    const listE = document.createElement('list');

    if (!options.margin)
        listE.classList.add('nomargin')

    if (options.style !== "none")
        listE.classList.add('style2')

    if (options.noHeigthLimit)
        listE.classList.add('noHeigthLimit')
    listE.addEventListener("value", (action) =>
    {

        listE.innerHTML = "";
        for (const iterator of (action as CustomEvent).detail)
        {
            const item = document.createElement('item');
            if (iterator.click)
                item.onclick = iterator.click;
            const left = document.createElement('span');
            if (typeof iterator.left === "string")
            {
                left.classList.add('left');
                left.innerText = iterator.left;
            } else
                left.append(iterator.left)
            item.append(left);
            if (iterator.right !== undefined || (iterator.actions !== undefined && iterator.actions.length !== 0))
            {
                const right = document.createElement('span');
                right.classList.add('right');

                if (iterator.right)
                {
                    if (iterator.actions && iterator.actions.length > 0)
                        iterator.right.classList.add('always');
                    right.append(iterator.right)
                }

                if (iterator.actions)
                    for (const action of iterator.actions)
                    {
                        const act = document.createElement('i');
                        act.innerText = action.type;
                        act.classList.add('material-icons-round');
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

export function multiStateSwitch(style: "normal" | "small", ...test: { title: string, action: () => void }[])
{
    const tinymenu = document.createElement('div');
    tinymenu.classList.add('tinymenu', style)
    for (const iterator of test)
    {
        const button = document.createElement('button');
        button.onclick = iterator.action;
        button.innerText = iterator.title;
        tinymenu.append(button);
    }
    return tinymenu;
}
