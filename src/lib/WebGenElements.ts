
import { createElement, custom, span } from "../components/index";
import { CardTypes, CommonCard } from "../types/card";

export class WebGenElements {
    private ele: HTMLElement;
    last: HTMLElement;

    constructor(element: HTMLElement) {
        this.ele = element;
        this.last = element;
    }

    setStyle = (style: string) => this.ele.setAttribute("style", style)

    /**
     * # Actions
     * @value (CardsArray)
     */
    cards({ minColumnWidth, maxWidth, gap }: {
        minColumnWidth?: number,
        maxWidth?: string,
        gap?: number
    }, ...cardArray: CommonCard[]) {
        let element = createElement("cardlist");
        if (minColumnWidth)
            element.style.setProperty('--card-min-width', minColumnWidth + "rem")
        if (maxWidth)
            element.style.setProperty('--max-width', maxWidth)
        if (gap)
            element.style.setProperty('--gap', minColumnWidth + "rem")

        element.addEventListener("value", (action: any) => {
            element.innerHTML = "";
            reRenderCards((action as CustomEvent).detail);
        })
        const reRenderCards = (elements: CommonCard[]) => {
            for (const cmCard of elements) {
                const card = createElement('card');

                if (cmCard.height && cmCard.height > 0)
                    card.style.gridRow = `span ${cmCard.height}`;

                if (cmCard.width && cmCard.width > 0)
                    card.style.gridColumn = `span calc(${cmCard.width})`;

                if (cmCard.type == CardTypes.Headless) {
                    card.append(cmCard.html)
                    element.append(card);
                } else if (cmCard.type == CardTypes.Default) {
                    if (cmCard.small) card.classList.add("small");
                    card.classList.add("lline")
                    card.append(custom('h1', cmCard.title, 'title'));
                    if (cmCard.subtitle) {
                        card.classList.add("subtitle")
                        card.append(span(cmCard.subtitle, 'subtitle'));
                    }

                    element.append(card);
                } else if (cmCard.type == CardTypes.Modern) {
                    let icon: any = createElement('img');

                    if (cmCard.icon) {
                        card.classList.add('img');
                        if (typeof cmCard.icon == "string") {
                            icon.loading = "lazy";
                            icon.alt = cmCard.title;
                            icon.width = 68;
                            icon.height = 68;
                            icon.src = cmCard.icon;
                        } else
                            icon = new DOMParser().parseFromString(cmCard.icon.svg, "image/svg+xml").children[ 0 ];
                    }
                    if (cmCard.icon && cmCard.align != "right")
                        card.append(icon)
                    card.classList.add('modern');
                    card.classList.add(cmCard.align);
                    const container = createElement('div');
                    container.classList.add('title-list')
                    if (cmCard.subtitle !== undefined) {
                        card.classList.add("subtitle")
                        const subtitle = createElement('h1');
                        subtitle.classList.add('subtitle');
                        subtitle.innerText = cmCard.subtitle;
                        container.append(subtitle);
                    }

                    container.append(custom('h1', cmCard.title, 'title'));
                    card.append(container);

                    if (cmCard.icon && cmCard.align == "right")
                        card.append(icon)

                    if (cmCard.description) {
                        card.classList.add("description")
                        card.append(span(cmCard.description, 'description'));
                    }
                    element.append(card);
                } else if (cmCard.type == CardTypes.Rich) {
                    if (cmCard.title)
                        card.append(custom('h1', cmCard.title, 'rich-title'));

                    card.classList.add("rich");
                    const container = createElement('div');
                    container.classList.add('container');
                    if (typeof cmCard.content == "string")
                        container.append(span(cmCard.content, "title"));
                    else if (cmCard.content instanceof HTMLElement)
                        container.append(cmCard.content);
                    else
                        cmCard.content.forEach(x => container.append(typeof x == "string" ? span(x, "title") : x));

                    card.append(container);
                    if (cmCard.buttons) {
                        let buttonlist = createElement("buttonlist");
                        card.classList.add('buttons');
                        cmCard.buttons.forEach(x => {
                            const button = custom('button', x.title, x.color);
                            button.onclick = x.action;
                            buttonlist.append(button)
                        });
                        card.append(buttonlist);
                    } else
                        card.style.paddingBottom = "var(--gap)"
                    element.append(card);
                } else if (cmCard.type == CardTypes.Note) {
                    card.classList.add('note');
                    card.append(
                        span(cmCard.icon, 'icon'),
                        span(cmCard.title, 'text')
                    );
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
    }) {
        let element = createElement('splitView');
        element.classList.add(settings.theme == undefined || settings.theme == "modern" ? 'm' : settings.theme);
        if (settings.maxWidth)
            element.classList.add('maxWidth');

        if (settings.maxWidth && settings.maxWidth != "default")
            element.style.maxWidth = settings.maxWidth;

        if (settings.nomargin)
            element.classList.add('nomargin');

        let sidebar = createElement('sidebar')
        if (settings.theme == "one")
            sidebar.classList.add('d');

        if (settings.sidebarIsList)
            sidebar.classList.add('list');

        let content = createElement('content');
        if (settings.defaultContentPadding)
            content.style.padding = "1rem";

        settings.left.forEach((x) => {
            sidebar.append(x instanceof HTMLElement ? x : x.last)
        });
        settings.right.forEach((x) => {
            content.append(x instanceof HTMLElement ? x : x.last)
        });
        element.append(sidebar);
        element.append(content);
        this.ele.append(element);
        this.last = element;
        return this;
    }

    custom(element: HTMLElement) {
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
    }) {
        let element = createElement('span');
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
    }): WebGenElements {
        if (settings.type == "big") {
            let element = createElement("span");
            if (settings.img != undefined) {
                element.classList.add("titlew", "withimg");
                element.innerHTML = `<img src="${settings.img}", stype="margin-bottom:3.2rem"><br>${settings.title}${settings.subtitle ? `<span class="subtitlew">${settings.subtitle}</span>` : ``}`;
            } else {
                element.classList.add("titlew");
                element.innerHTML = `${settings.title}${settings.subtitle ? `<span class="subtitlew" style="margin-left: 0;${(settings.title.indexOf("y") != -1 || settings.title.indexOf("j") != -1 || settings.title.indexOf("q") != -1 || settings.title.indexOf("p") != -1) ? 'margin-top: 0.5rem;' : ''}">${settings.subtitle}</span>` : ''}`;
            }
            this.ele.append(element);
            this.last = element;
            return this;
        }
        else if (settings.type === "small") {
            let element = createElement("h2");
            element.innerHTML = settings.title;

            if (settings.subtitle) {
                let element2 = createElement("h4");
                element2.innerHTML = settings.subtitle;
                let element3 = createElement("br");
                this.ele.append(element, element2, element3);
            } else
                this.ele.append(element);

            this.last = element;
            return this;
        }
        return this;
    }

    buttons(settings: { big: boolean, list: { text: string, onclick: (e: HTMLButtonElement) => any }[] }) {
        let element = createElement("center");
        settings.list.forEach(x => {
            let button = createElement("button") as HTMLButtonElement;
            if (settings.big) button.classList.add("one")
            button.innerHTML = x.text;
            button.onclick = () => x.onclick(button);
            element.append(button);
        });
        if (settings.big) {
            let br_mh = createElement("br");
            br_mh.classList.add("mobilehide");
            let br = createElement("br");
            this.ele.append(br_mh, br_mh, br_mh, br);
        }
        this.ele.append(element);
        this.last = element;
        return this;
    }
}