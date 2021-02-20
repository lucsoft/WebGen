
import { format, htmlStringy } from "../components";
import { CardTypes, CommonCard } from "../types/card";
import { Style } from './Style';

const hasTouch = () =>
    'ontouchstart' in document.documentElement
    || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export type CardButtonList = {
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
    last: HTMLElement;

    constructor(element: HTMLElement)
    {
        this.ele = element;
        this.last = element;
    }

    setStyle = (style: string) => this.ele.setAttribute("style", style)

    cardButtons(settings: {
        small?: boolean,
        columns?: "auto" | "1" | "2" | "3" | "4" | "5",
        list: CardButtonList[]
    })
    {
        let element = document.createElement("cardlist");
        if (settings.small)
            element.classList.add("small");

        element.classList.add("grid_columns_" + settings.columns || "auto");
        settings.list.forEach((e) =>
        {
            let card = document.createElement("card");
            card.classList.add("cardButton");
            if (e.active)
                card.classList.add('active');

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
                                if (imgE) imgE.src = img;
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
                card.onclick = () => card.classList.toggle('active');

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
    }, ...cardArray: CommonCard[])
    {
        let element = document.createElement("cardlist");
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
        const reRenderCards = (elements: CommonCard[]) =>
        {
            for (const cmCard of elements)
            {
                const card = document.createElement('card');

                if (cmCard.height && cmCard.height > 0)
                    card.style.gridRow = `span ${cmCard.height}`;

                if (cmCard.width && cmCard.width > 0)
                    card.style.gridColumn = `span calc(${cmCard.width})`;

                if (cmCard.type == CardTypes.Headless)
                {
                    card.append(cmCard.html)
                    element.append(card);
                } else if (cmCard.type == CardTypes.Default)
                {
                    if (cmCard.small) card.classList.add("small");
                    card.classList.add("lline")

                    const title = document.createElement('h1');
                    title.classList.add('title');
                    htmlStringy(title, cmCard.title)
                    card.append(title);
                    if (cmCard.subtitle)
                    {
                        card.classList.add("subtitle")
                        const subtitle = document.createElement('span');
                        subtitle.classList.add('subtitle');
                        htmlStringy(subtitle, cmCard.subtitle)
                        card.append(subtitle);
                    }

                    element.append(card);
                } else if (cmCard.type == CardTypes.Modern)
                {
                    const icon: any = document.createElement('img');

                    if (cmCard.icon)
                    {
                        card.classList.add('img');
                        icon.loading = "lazy";
                        icon.alt = cmCard.title;
                        icon.width = 68;
                        icon.height = 68;
                        icon.src = cmCard.icon;
                    }
                    if (cmCard.icon && cmCard.align == "left")
                        card.append(icon)
                    card.classList.add('modern');
                    card.classList.add(cmCard.align);
                    const container = document.createElement('div');
                    container.classList.add('title-list')
                    if (cmCard.subtitle !== undefined)
                    {
                        card.classList.add("subtitle")
                        const subtitle = document.createElement('h1');
                        subtitle.classList.add('subtitle');
                        subtitle.innerText = cmCard.subtitle;
                        container.append(subtitle);
                    }

                    const title = document.createElement('h1');
                    title.classList.add('title');
                    htmlStringy(title, cmCard.title)
                    container.append(title);
                    card.append(container);

                    if (cmCard.icon && cmCard.align == "right")
                        card.append(icon)

                    if (cmCard.description)
                    {
                        card.classList.add("description")
                        const description = document.createElement('span');
                        description.classList.add('description');
                        htmlStringy(description, cmCard.description)
                        card.append(description);
                    }
                    element.append(card);
                } else if (cmCard.type == CardTypes.Rich)
                {
                    if (cmCard.title)
                    {
                        let spantitle = document.createElement("h1");
                        spantitle.classList.add('rich-title');
                        htmlStringy(spantitle, cmCard.title)
                        card.append(spantitle);
                    }
                    card.classList.add("rich");
                    const container = document.createElement('div');
                    container.classList.add('container');
                    if (typeof cmCard.content == "string")
                        container.append(format(cmCard.content));
                    else if (cmCard.content instanceof HTMLElement)
                        container.append(cmCard.content);
                    else
                        cmCard.content.forEach(x =>
                            container.append(typeof x == "string"
                                ? format(x)
                                : x
                            ));

                    card.append(container);
                    if (cmCard.buttons)
                    {
                        let buttonlist = document.createElement("buttonlist");
                        card.classList.add('buttons');
                        cmCard.buttons.forEach(x =>
                        {
                            const button = document.createElement('button');
                            button.onclick = x.action;
                            button.classList.add(x.color);
                            htmlStringy(button, x.title)
                            buttonlist.append(button)
                        });
                        card.append(buttonlist);
                    } else
                        card.style.paddingBottom = "var(--gap)"
                    element.append(card);
                } else if (cmCard.type == CardTypes.Note)
                {
                    card.classList.add('note');
                    const icon = document.createElement('span');
                    icon.classList.add('icon');

                    icon.innerText = cmCard.icon;
                    const text = document.createElement('span');
                    text.classList.add('text');
                    htmlStringy(text, cmCard.title)
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
            element.classList.add('nomargin');

        let sidebar = document.createElement('sidebar')
        if (settings.theme == "one")
            sidebar.classList.add('d');

        if (settings.sidebarIsList)
            sidebar.classList.add('list');

        let content = document.createElement('content');
        if (settings.defaultContentPadding)
            content.style.padding = "1rem";

        settings.left.forEach((x) =>
        {
            sidebar.append(x instanceof HTMLElement ? x : x.last)
        });
        settings.right.forEach((x) =>
        {
            content.append(x instanceof HTMLElement ? x : x.last)
        });
        element.append(sidebar);
        element.append(content);
        this.ele.append(element);
        this.last = element;
        return this;
    }

    custom(element: HTMLElement)
    {
        this.ele.append(element);
        this.last = element;
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
        element.classList.add('pagetitle');
        element.addEventListener("value", (action) =>
            element.innerHTML = (action as CustomEvent).detail)
        element.dispatchEvent(new CustomEvent("value", { detail: settings.text }))
        this.ele.append(element);
        this.last = element;
        return this;
    }

    /**
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
        {
            let element = document.createElement("h2");
            element.innerHTML = settings.title;

            if (settings.subtitle)
            {
                let element2 = document.createElement("h4");
                element2.innerHTML = settings.subtitle;
                let element3 = document.createElement("br");
                this.ele.append(element, element2, element3);
            } else
                this.ele.append(element);

            this.last = element;
            return this;
        }
        return this;
    }

    buttons(settings: { big: boolean, list: { text: string, onclick: (e: HTMLButtonElement) => any }[] })
    {
        let element = document.createElement("center");
        settings.list.forEach(x =>
        {
            let button = document.createElement("button");
            if (settings.big) button.classList.add("one")
            button.innerHTML = x.text;
            button.onclick = () => x.onclick(button);
            element.append(button);
        });
        if (settings.big)
        {
            let br_mh = document.createElement("br");
            br_mh.classList.add("mobilehide");
            let br = document.createElement("br");
            this.ele.append(br_mh, br_mh, br_mh, br);
        }
        this.ele.append(element);
        this.last = element;
        return this;
    }
}