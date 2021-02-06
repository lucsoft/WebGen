
import { Style } from './Style';
import { DefaultCard, ModernCard, RichCard, NoteCard, checkIfDefaultCard, checkIfModernCard, checkIfRichCard, checkIfNoteCard, checkIfHeadlessCard, HeadlessCard } from './Cards';

function hasTouch()
{
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
}

export type CardArray = (DefaultCard | ModernCard | RichCard | NoteCard | HeadlessCard)[];
class Components
{
    cardProgress(id: string)
    {
        const cardprogress = document.createElement("span");
        const pro = document.createElement("span");
        pro.classList.add("pro")
        pro.id = id;
        cardprogress.classList.add("cardprogress");
        cardprogress.append(pro);
        return cardprogress;
    }
    format(text: string)
    {
        const formt = document.createElement("span");
        formt.classList.add('text');
        formt.innerHTML = text;
        return formt;
    }

    action(element: HTMLElement, type: string, value: unknown)
    {
        element.dispatchEvent(new CustomEvent(type, { detail: value }))
    }
    /**
     * # Actions
     * @checked (boolean)
     * @disable (boolean)
     */
    switch(options: {
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
    span(message: string | HTMLElement): HTMLElement
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
    dropdown(options: { default: number; disable?: boolean; small?: boolean; } = { default: 0 }, ...entrys: { title: string, action: () => void }[]): HTMLElement
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

    input(options: { type?: string, placeholder?: string, value?: string, width?: string })
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
    list(options: { margin?: boolean; style?: "none" | "default"; noHeigthLimit?: boolean }, ...listRaw: { left: string | HTMLElement; right?: HTMLElement; click?: () => void; actions?: { type: string, click: () => void }[] }[])
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
    multiStateSwitch(style: "normal" | "small", ...test: { title: string, action: () => void }[])
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
}

export interface CardButtonList
{
    title: string,
    icon?: string,
    value?: string,
    active?: boolean,
    id: string,
    onClick?: (toggleState: (state: string, img?: string) => void, currentState: boolean, title: HTMLSpanElement, element: HTMLElement, id: string) => void
}

export class WebGenElements
{
    private ele: HTMLElement;
    components: Components = new Components();
    style: Style;
    last: HTMLElement;

    constructor(element: HTMLElement, style: Style)
    {
        this.ele = element;
        this.style = style;
        this.last = element;
    }
    private getID()
    {
        return Math.round(Math.random() * 100000000 + 10000000).toString()
    }

    setStyle(style: string)
    {
        this.ele.setAttribute("style", style);
    }

    cardButtons(settings: {
        small?: boolean,
        columns?: "auto" | "1" | "2" | "3" | "4" | "5",
        list: CardButtonList[]
    })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        if (settings.small)
        {
            element.classList.add("small");
        }

        element.classList.add("grid_columns_" + settings.columns || "auto");
        settings.list.forEach((e) =>
        {
            let card = document.createElement("card");
            card.classList.add("cardButton");
            if (e.active)
            {
                card.classList.add('active');
            }
            card.id = e.id;
            card.innerHTML = `${e.icon ? `<img src="${e.icon}">` : ''}<span class="title">${e.title}</span>${e.value != undefined ? `<span class="value">${e.value}</span>` : ''}`;
            if (e.onClick)
            {

                let title = card.querySelector('.title');
                let value = card.querySelector('.value');
                if (hasTouch())
                    card.classList.add('disablehover');

                card.onclick = () =>
                {
                    if (!hasTouch())
                    {
                        card.style.animation = "clicked 250ms cubic-bezier(0.35, -0.24, 0, 1.29)";
                        setTimeout(() => { card.style.animation = ""; }, 500);
                    }
                    if (e.onClick)
                        e.onClick((text, img) =>
                        {
                            if (value)
                                (value as HTMLSpanElement).innerText = text;
                            card.classList.toggle('active');
                            if (img)
                            {
                                const imgE = card.querySelector('img');
                                if (imgE)
                                    imgE.src = img;
                            }

                            if (hasTouch())
                            {
                                card.style.animation = "clickedM 250ms cubic-bezier(0.35, -0.24, 0, 1.29)";
                                setTimeout(() => { card.style.animation = ""; }, 500);
                            }
                        }, card.classList.contains("active"), title as HTMLSpanElement, card, e.id);
                }
            }
            else
            {
                card.onclick = () => card.classList.toggle('active');
            }
            element.append(card);
        });
        this.ele.append(element);
        this.last = element;
        return this;
    }

    /**
     * # Actions
     * @value (CardsArray)
     */
    cards({ minColumnWidth, maxWidth, gap }: {
        minColumnWidth?: number,
        maxWidth?: string,
        gap?: number
    }, ...cardArray: CardArray)
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        if (minColumnWidth)
            element.style.setProperty('--card-min-width', minColumnWidth + "rem")
        if (maxWidth)
            element.style.setProperty('--max-width', maxWidth)
        if (gap)
            element.style.setProperty('--gap', minColumnWidth + "rem")

        element.addEventListener("value", (action) =>
        {
            element.innerHTML = "";
            reRenderCards((action as CustomEvent).detail);
        })
        const reRenderCards = (elements: CardArray) =>
        {
            for (const rawData of elements)
            {
                const card = document.createElement('card');

                if (rawData.height && rawData.height > 0)
                    card.style.gridRow = `span ${rawData.height}`;

                if (rawData.width && rawData.width > 0)
                    card.style.gridColumn = `span calc(${rawData.width})`;

                if (checkIfHeadlessCard(rawData))
                {
                    card.append(rawData.html)
                    element.append(card);
                } else if (checkIfDefaultCard(rawData))
                {
                    if (rawData.small)
                        card.classList.add("small");
                    card.classList.add("lline")

                    const title = document.createElement('h1');
                    title.classList.add('title');
                    if (typeof rawData.title === "string")
                        title.innerText = rawData.title;
                    else
                        title.append(rawData.title);
                    card.append(title);
                    if (rawData.subtitle)
                    {
                        card.classList.add("subtitle")
                        const subtitle = document.createElement('span');
                        subtitle.classList.add('subtitle');
                        if (typeof rawData.subtitle === "string")
                            subtitle.innerText = rawData.subtitle;
                        else
                            subtitle.append(rawData.subtitle);
                        card.append(subtitle);
                    }

                    element.append(card);
                } else if (checkIfModernCard(rawData))
                {
                    const icon: any = document.createElement('img');

                    if (rawData.icon)
                    {
                        card.classList.add('img');
                        icon.loading = "lazy";
                        icon.alt = rawData.title;
                        icon.width = 68;
                        icon.height = 68;
                        icon.src = rawData.icon;
                    }
                    if (rawData.icon && rawData.align == "left")
                        card.append(icon)
                    card.classList.add('modern');
                    card.classList.add(rawData.align);
                    const container = document.createElement('div');
                    container.classList.add('title-list')
                    if (rawData.subtitle !== undefined)
                    {
                        card.classList.add("subtitle")
                        const subtitle = document.createElement('h1');
                        subtitle.classList.add('subtitle');
                        subtitle.innerText = rawData.subtitle;
                        container.append(subtitle);
                    }

                    const title = document.createElement('h1');
                    title.classList.add('title');
                    if (typeof rawData.title === "string")
                        title.innerText = rawData.title;
                    else
                        title.append(rawData.title);
                    container.append(title);
                    card.append(container);

                    if (rawData.icon && rawData.align == "right")
                        card.append(icon)

                    if (rawData.description)
                    {
                        card.classList.add("description")
                        const description = document.createElement('span');
                        description.classList.add('description');
                        if (typeof rawData.description === "string")
                            description.innerText = rawData.description;
                        else
                            description.append(rawData.description);
                        card.append(description);
                    }
                    element.append(card);
                } else if (checkIfRichCard(rawData))
                {
                    if (rawData.title)
                    {
                        let spantitle = document.createElement("h1");
                        spantitle.classList.add('rich-title');
                        if (typeof rawData.title === "string")
                            spantitle.innerText = rawData.title;
                        else
                            spantitle.append(rawData.title);
                        card.append(spantitle);
                    }
                    card.classList.add("rich");
                    const container = document.createElement('div');
                    container.classList.add('container');
                    if (typeof rawData.content == "string")
                    {
                        container.append(this.components.format(rawData.content));
                    } else if (rawData.content instanceof HTMLElement)
                    {
                        container.append(rawData.content);
                    } else
                    {
                        rawData.content.forEach(x =>
                        {
                            if (typeof x == "string")
                                container.append(this.components.format(x));
                            else
                                container.append(x);
                        });
                    }
                    card.append(container);
                    if (rawData.buttons)
                    {
                        let buttonlist = document.createElement("buttonlist");
                        card.classList.add('buttons');
                        rawData.buttons.forEach(x =>
                        {
                            const button = document.createElement('button');
                            button.onclick = x.action;
                            button.classList.add(x.color);
                            if (typeof x.text == "string")
                                button.innerText = x.text;
                            else
                                card.append(x.text);
                            buttonlist.append(button)
                        });
                        card.append(buttonlist);
                    }
                    element.append(card);
                } else if (checkIfNoteCard(rawData))
                {
                    card.classList.add('note');
                    const icon = document.createElement('span');
                    icon.classList.add('icon');

                    icon.innerText = rawData.icon;
                    const text = document.createElement('span');
                    text.classList.add('text');
                    if (typeof rawData.title === "string")
                        text.innerText = rawData.title;
                    else
                        text.append(rawData.title);
                    card.append(icon, text);
                    element.append(card);
                }
            }
        };
        reRenderCards(cardArray);
        this.ele.append(element);
        this.last = element;
        return this;
    }

    /**
     * What theme? just use modern
     */
    splitView(settings: {
        theme?: "list" | "modern" | "one" | "auto";
        left: (HTMLElement | (WebGenElements & { last: HTMLElement; }))[],
        right: (HTMLElement | (WebGenElements & { last: HTMLElement; }))[],
        nomargin?: boolean,
        defaultContentPadding?: boolean,
        sidebarIsList?: boolean,
        maxWidth?: string | "default"
    })
    {
        let element = document.createElement('splitView');
        element.classList.add(settings.theme == undefined || settings.theme == "modern" ? 'm' : settings.theme);
        if (settings.maxWidth)
            element.classList.add('maxWidth');

        if (settings.maxWidth && settings.maxWidth != "default")
            element.style.maxWidth = settings.maxWidth;

        if (settings.nomargin)
        {
            element.classList.add('nomargin');
        }
        let sidebar = document.createElement('sidebar')
        if (settings.theme == "one")
        {
            sidebar.classList.add('d');
        }
        if (settings.sidebarIsList)
        {
            sidebar.classList.add('list');
        }
        let content = document.createElement('content');
        if (settings.defaultContentPadding)
        {
            content.style.padding = "1rem";
        }
        settings.left.forEach((x) =>
        {
            if (x instanceof HTMLElement)
                sidebar.append(x)
            else
                sidebar.append(x.last)
        });
        settings.right.forEach((x) =>
        {
            if (x instanceof HTMLElement)
                content.append(x)
            else
                content.append(x.last)
        });
        element.append(sidebar);
        element.append(content);
        this.ele.append(element);
        this.last = element;
        return this;
    }

    custom(settings: {
        element: HTMLElement
    })
    {
        this.ele.append(settings.element);
        this.last = settings.element;
        return this;
    }

    /**
     * # Actions
     * @value (string)
     */
    pageTitle(settings: {
        text: string
    })
    {
        let element = document.createElement('span');
        element.id = this.getID();
        element.classList.add('pagetitle');
        element.addEventListener("value", (action) =>
        {
            element.innerHTML = (action as CustomEvent).detail;
        })
        element.dispatchEvent(new CustomEvent("value", { detail: settings.text }))
        this.ele.append(element);
        this.last = element;
        return this;
    }
    /**
     *
     * @param settings img only works on big
     */
    title(settings: {
        title: string,
        subtitle?: string,
        img?: string,
        type: "small" | "big"
    }): WebGenElements
    {
        if (settings.type == "big")
        {
            let element = document.createElement("span");
            element.id = this.getID();
            if (settings.img != undefined)
            {
                element.classList.add("titlew", "withimg");
                element.innerHTML = `<img src="${settings.img}", stype="margin-bottom:3.2rem"><br>${settings.title}${settings.subtitle ? `<span class="subtitlew">${settings.subtitle}</span>` : ``}`;
            } else
            {
                element.classList.add("titlew");
                element.innerHTML = `${settings.title}${settings.subtitle ? `<span class="subtitlew" style="margin-left: 0;${(settings.title.indexOf("y") != -1 || settings.title.indexOf("j") != -1 || settings.title.indexOf("q") != -1 || settings.title.indexOf("p") != -1) ? 'margin-top: 0.5rem;' : ''}">${settings.subtitle}</span>` : ''}`;
            }
            this.ele.append(element);
            this.last = element;
            return this;
        }
        else if (settings.type === "small")
            if (settings.subtitle)
            {
                let element = document.createElement("h2");
                element.id = this.getID();
                element.innerHTML = settings.title;
                this.ele.append(element);
                let element2 = document.createElement("h4");
                element2.innerHTML = settings.subtitle;
                this.ele.append(element2);
                let element3 = document.createElement("br");
                this.ele.append(element3);
                this.last = element;
                return this;
            } else
            {
                let element = document.createElement("h2");
                element.id = this.getID();
                element.innerHTML = settings.title;
                this.ele.append(element);
                this.last = element;
                return this;
            }
        return this;
    }

    buttons(settings: { big: boolean, list: { text: string, onclick: (e: HTMLButtonElement) => any }[] })
    {
        let element = document.createElement("center");
        element.id = this.getID();
        settings.list.forEach(x =>
        {
            let button = document.createElement("button");
            if (settings.big)
            {
                button.classList.add("one")
                button.innerHTML = x.text;
                button.onclick = () => x.onclick(button);
            } else
            {
                button.innerHTML = x.text;
                button.onclick = () => x.onclick(button);
            }
            element.append(button);
        });
        if (settings.big)
        {
            let br_mh = document.createElement("br");
            br_mh.classList.add("mobilehide");
            let br = document.createElement("br");
            this.ele.append(br_mh);
            this.ele.append(br_mh);
            this.ele.append(br_mh);
            this.ele.append(br);
        }
        this.ele.append(element);
        this.last = element;
        return this;
    }
}