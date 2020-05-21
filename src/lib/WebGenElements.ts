
import { Style } from './Style';

function hasTouch()
{
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
}
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
    switch(onClick: (active: boolean) => void, onAnimationComplete: (active: boolean) => void = () => { })
    {
        const span = document.createElement('span');
        const switchE = document.createElement('switch');
        const input = document.createElement('input');
        input.classList.add("hide");
        input.type = "checkbox";
        span.onclick = () =>
        {
            switchE.classList.toggle("active");
            input.checked = !input.checked;
            onClick(input.checked);
            setTimeout(() => onAnimationComplete(input.checked), 500);
        }
        span.append(switchE);
        span.append(input);
        return span;
    }
    list(options: { margin?: boolean; style?: "none" | "default" }, ...list: { left: string | HTMLElement; right?: string | HTMLElement; click?: () => void; actions?: { type: string, click: () => void }[] }[])
    {
        const listE = document.createElement('list');

        if (!options.margin)
            listE.classList.add('nomargin')

        if (options.style !== "none")
            listE.classList.add('style2')

        for (const iterator of list)
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
                    right.append(iterator.right)

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

export class SearchEntry
{

    constructor(name: string, id: string)
    {
        this.name = name;
        this.id = id;
    }

    name: string;
    icon?: string;
    tags?: string[];
    category?: string;
    suffix?: string;
    id: string;

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
type DefaultCard =
    {
        title: string,
        subtitle?: string,
        enableHover?: boolean,
        onClick?: () => void
    }
type ModernCard =
    {
        title: string;
        subtitle?: string;
        enableHover?: boolean;
        onClick?: () => void;
        icon?: string;
        description?: string;
        align: "right" | "left";
    }
const checkIfModernCard = (card: any): card is ModernCard =>
{
    return typeof card.align === "string";
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
    private getMaterialIcon(name: string)
    {
        let i = document.createElement("i");
        i.classList.add("material-icons");
        i.innerHTML = name;
        return i;
    }
    setStyle(style: string)
    {
        this.ele.setAttribute("style", style);
    }

    note(settings: { type: "home" | "fire" | "error" | "warn" | "developer", text: string, maxWidth?: string | "default" })
    {
        const element = document.createElement('cardlist');
        element.id = this.getID();
        if (settings.maxWidth != undefined)
            element.classList.add("max-width");

        if (settings.maxWidth != "default")
            element.setAttribute("style", "max-width:" + settings.maxWidth);

        element.classList.add("grid_columns_1");

        let elementCard = document.createElement("card");

        elementCard.classList.add("note", settings.type);
        elementCard.innerHTML = settings.text;
        element.append(elementCard);
        this.ele.appendChild(element);
        this.last = element;
        return this;
    }

    cardButtons(settings: {
        small?: boolean,
        columns?: "auto" | "1" | "2" | "3" | "4" | "5",
        maxWidth?: string | "defaut",
        list: CardButtonList[]
    })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        if (settings.small)
        {
            element.classList.add("small");
        }
        if (settings.maxWidth != undefined)
        {
            element.classList.add("max-width");
        }
        if (settings.maxWidth != "default")
        {
            element.setAttribute("style", "max-width:" + settings.maxWidth);
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

    cards<style extends ("big" | "small" | "modern")>(settings: {
        style: style
        hidden?: boolean,
        columns: "auto" | "1" | "2" | "3" | "4" | "5",
        maxWidth?: string | "default",
        cards: (style extends "big" ? DefaultCard[] : (style extends "small" ? DefaultCard[] : ModernCard[]))
    })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        if (settings.style === "small")
            element.classList.add("small");

        if (settings.hidden)
            element.classList.add("hidden");

        if (settings.maxWidth != undefined)
            element.classList.add("max-width");

        if (settings.maxWidth != "default")
            element.setAttribute("style", "max-width:" + settings.maxWidth);

        element.classList.add("grid_columns_" + settings.columns);
        for (const rawData of settings.cards)
        {
            const data = rawData as (ModernCard | DefaultCard);
            const card = document.createElement('card');
            if (!checkIfModernCard(data))
                card.classList.add("lline")
            if (!data.enableHover)
                card.classList.add("disablehover")

            if (checkIfModernCard(data))
            {
                if (data.icon)
                {
                    const icon: any = document.createElement('img');
                    icon.loading = "lazy";
                    icon.src = data.icon
                    card.append(icon);
                }
                card.classList.add('modern');
                card.classList.add(data.align);
            }

            if (checkIfModernCard(data) && data.subtitle !== undefined)
            {
                card.classList.add("subtitle")
                const subtitle = document.createElement('span');
                subtitle.classList.add('subtitle');
                subtitle.innerText = data.subtitle;
                card.append(subtitle);

            }
            const title = document.createElement('span');
            title.classList.add('title');
            title.innerText = data.title;
            card.append(title);

            if (!checkIfModernCard(data) && data.subtitle !== undefined)
            {
                card.classList.add("subtitle")
                const subtitle = document.createElement('span');
                subtitle.classList.add('subtitle');
                subtitle.innerText = data.subtitle;
                card.append(subtitle);
            }
            if (checkIfModernCard(data))

                if (data.description)
                {
                    const description = document.createElement('span');
                    description.classList.add('description');
                    description.innerText = data.description;
                    card.append(description);
                }

            element.append(card);
        }
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
        {
            element.classList.add('maxWidth');
        }
        if (settings.maxWidth && settings.maxWidth != "default")
        {
            element.style.maxWidth = settings.maxWidth;
        }
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

    pageTitle(settings: {
        text: string,
        maxWidth?: string | "default"
    })
    {
        let element = document.createElement('span');
        element.id = this.getID();
        element.classList.add('pagetitle');
        if (settings.maxWidth)
            element.classList.add('maxWidth');

        if (settings.maxWidth && settings.maxWidth != "default")
            element.style.maxWidth = settings.maxWidth;

        element.innerHTML = settings.text;
        this.ele.append(element);
        return this;
    }
    /**
     *
     * @param settings img only works on big and modern
     */
    title(settings: {
        title: string,
        subtitle?: string,
        img?: string,
        type: "small" | "big" | "modern"
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

    search(settings: {
        type: "smart" | "default",
        maxWidth?: string | "default",
        mode?: "showBegin" | "hideBegin" | "hideWhenEmpty"
        placeholder?: string,
        notfound?: string,
        onsearch?: (text: string) => any,
        actions?: {
            close?: () => void,
            click?: (arg: SearchEntry) => void,
            download?: (arg: SearchEntry) => void,
            edit?: (arg: SearchEntry) => void,
            remove?: (arg: SearchEntry) => void
        },
        index: SearchEntry[]
    })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        let lastsearch = "";
        element.classList.add("grid_columns_1");
        if (settings.maxWidth != undefined)
            element.classList.add("max-width");

        if (settings.maxWidth != "default" && settings.maxWidth != undefined)
            element.style.maxWidth = settings.maxWidth;

        let card = document.createElement("card");
        card.classList.add("search", "disablehover");
        let input: HTMLInputElement = document.createElement("input");
        let ul: HTMLUListElement = document.createElement("ul")
        input.placeholder = settings.placeholder || "Search...";
        if (settings.actions?.close)
        {
            let icon = this.getMaterialIcon("close");
            icon.onclick = settings.actions?.close;
            card.append(icon);
        }

        let list: SearchEntry[] = [];

        input.onkeyup = (d: KeyboardEvent) =>
        {
            if (d.key == "Enter")
            {
                if (ul.children.item.length == 1)
                {
                    let element = <HTMLButtonElement>ul.children[ 0 ];
                    if (element == null)
                        return;

                    element.click();
                }

            }
            if (lastsearch == input.value) return;
            lastsearch = input.value;
            if (settings.mode === "hideWhenEmpty" && lastsearch === "")
            {
                ul.innerHTML = "";
                return;
            }
            if (settings.type == "smart" && settings.index)
            {
                let smart = input.value.split(` `);
                let tags: string[] = [];
                let name = "";
                smart.forEach(e =>
                {
                    if (e.startsWith("#") || e.startsWith("!"))
                        tags.push(e);
                    else
                        name += " " + e;

                });
                name = name.slice(1);
                list = settings.index;
                tags.forEach(e =>
                {
                    if (e.startsWith("#"))
                        list = list.filter(x => x.tags ? x.tags.indexOf(e.slice(1)) != -1 : false);
                    else if (e.startsWith("!"))
                        list = list.filter(x => x.tags ? x.tags.indexOf(e.slice(1)) == -1 : false);
                    if (list.length == 0)
                        return;
                });

                list = list.filter(x => x.name.toLowerCase().includes(name.toLowerCase()));
            } else
                list = settings.index.filter(x => x.name.toLowerCase().includes(input.value.toLowerCase()));


            ul.innerHTML = "";
            list.forEach(x =>
            {
                let tags: HTMLElement[] = [];
                if (x.tags != undefined)
                {
                    x.tags.filter((tag) =>
                    {
                        const tagE = document.createElement("span");
                        tagE.classList.add("tag");
                        tagE.innerText = tag;
                        tags.push(tagE);
                    })
                }
                let li = document.createElement("li");
                li.onclick = () => settings.actions?.click?.(x);
                const left = document.createElement("left");
                const right = document.createElement("right");
                if (x.icon)
                {
                    const image = document.createElement("img");
                    image.src = x.icon;
                    left.append(image);
                }
                left.append(x.name);
                if (x.category)
                {
                    const category = document.createElement("span");
                    category.classList.add("tag", "category");
                    category.innerText = x.category;
                    right.append(category);
                }
                if (x.suffix)
                    right.append(x.suffix);
                right.append(...tags);
                if (settings.actions?.download)
                {
                    const download = document.createElement("i");
                    download.classList.add("material-icons-round")
                    download.innerHTML = "get_app";
                    download.onclick = () => settings.actions?.download?.(x);
                    right.append(download);
                }
                if (settings.actions?.edit)
                {
                    const edit = document.createElement("i");
                    edit.classList.add("material-icons-round")
                    edit.innerHTML = "edit";
                    edit.onclick = () => settings.actions?.edit?.(x);
                    right.append(edit);
                }
                if (settings.actions?.remove)
                {
                    const remove = document.createElement("i");
                    remove.classList.add("material-icons-round")
                    remove.innerHTML = "delete";
                    remove.onclick = () => settings.actions?.remove?.(x);
                    right.append(remove);
                }
                li.append(left);
                li.append(right);
                ul.append(li);
            });
            if (ul.childNodes.length == 0 && settings.notfound !== undefined)
            {
                let li = document.createElement("li");
                li.onclick = () => settings?.actions?.click?.({ id: "notfound", name: "notfound" });
                li.classList.add("gray");
                li.innerText = settings.notfound;
                ul.append(li);
            }

        };

        card.append(input);
        card.append(ul);
        element.append(card);
        this.ele.append(element);

        if (settings.mode === "showBegin")
        {
            settings.index.forEach(x =>
            {
                let tags: HTMLElement[] = [];
                if (x.tags != undefined)
                {
                    x.tags.filter((tag) =>
                    {
                        const tagE = document.createElement("span");
                        tagE.classList.add("tag");
                        tagE.innerText = tag;
                        tags.push(tagE);
                    })
                }
                let li = document.createElement("li");
                li.onclick = () => settings.actions?.click?.(x);
                const left = document.createElement("left");
                const right = document.createElement("right");
                if (x.icon)
                {
                    const image: any = document.createElement("img");
                    image.src = x.icon;
                    image.loading = "lazy";
                    left.append(image);
                }
                left.append(x.name);
                if (x.category)
                {
                    const category = document.createElement("span");
                    category.classList.add("tag", "category");
                    category.innerText = x.category;
                    right.append(category);
                }
                if (x.suffix)
                    right.append(x.suffix);
                right.append(...tags);
                if (settings.actions?.download)
                {
                    const download = document.createElement("i");
                    download.classList.add("material-icons-round")
                    download.innerHTML = "get_app";
                    download.onclick = () => settings.actions?.download?.(x);
                    right.append(download);
                }
                if (settings.actions?.edit)
                {
                    const edit = document.createElement("i");
                    edit.classList.add("material-icons-round")
                    edit.innerHTML = "edit";
                    edit.onclick = () => settings.actions?.edit?.(x);
                    right.append(edit);
                }
                if (settings.actions?.remove)
                {
                    const remove = document.createElement("i");
                    remove.classList.add("material-icons-round")
                    remove.innerHTML = "delete";
                    remove.onclick = () => settings.actions?.remove?.(x);
                    right.append(remove);
                }
                li.append(left);
                li.append(right);
                ul.append(li);
            });

        }

        this.last = element;
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

    login(settings: {
        text?: string,
        url?: string,
        email?: string,
        button?: string,
        password?: string,
        maxWidth?: string,
        login: (password: HTMLInputElement, email: HTMLInputElement, url: HTMLInputElement, master: HTMLElement) => any
    })
    {
        let element = document.createElement("cardlist");
        element.classList.add('grid_columns_1', 'max-width');
        element.style.maxWidth = settings.maxWidth || "35rem";
        element.id = this.getID();

        let card = document.createElement("card");


        card.classList.add('popup');
        card.classList.add('login');
        let form = document.createElement("form");
        let span1 = document.createElement("span");
        span1.classList.add("popup-title");
        span1.innerHTML = settings.text || "Login";
        card.append(span1);
        let url: HTMLInputElement = document.createElement("input");
        let email: HTMLInputElement = document.createElement("input");
        let password: HTMLInputElement = document.createElement("input");
        if (settings.url != undefined)
        {
            url.type = "url";
            url.name = "";
            url.placeholder = settings.url;
            form.append(url);
        }
        if (settings.email != undefined)
        {
            email.type = "email";
            email.placeholder = settings.email;
            form.append(email);
        }
        if (settings.password != undefined)
        {
            password.type = "password";
            password.placeholder = settings.password;
            form.append(password);
        }
        let span = document.createElement("span");
        span.classList.add("errormsg");
        let button = document.createElement("input");
        button.type = "button";
        button.value = settings.button || "Login";
        form.append(button);
        password.onkeyup = (e) =>
        {
            if (e.key == "Enter")
            {
                button.click();
            }
        }
        button.onclick = () =>
        {
            settings.login(password, email, url, span);
        }
        card.append(form);
        element.append(card);
        this.ele.append(element);
        this.last = element;
        return this;
    }

    window(settings: {
        maxWidth?: "default" | string,
        title?: string,
        buttons?: {
            color: string,
            text: string,
            onclick: () => void
        }[],
        content: string | HTMLElement | (HTMLElement | string)[]
    } = { content: '', maxWidth: 'default' })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        element.classList.add("grid_columns_1");
        if (settings.maxWidth != "disabled")
        {
            element.classList.add("max-width");
        }
        if (settings.maxWidth != "default" && settings.maxWidth)
        {
            element.style.maxWidth = settings.maxWidth;
        }
        let card = document.createElement("card");
        if (settings.title)
        {
            let spantitle = document.createElement("span");
            spantitle.classList.add('popup-title');
            spantitle.innerHTML = settings.title;
            card.append(spantitle);
        }
        card.classList.add("popup");
        if (typeof settings.content == "string")
        {
            card.append(this.components.format(settings.content));
        } else if (settings.content instanceof HTMLElement)
        {
            card.append(settings.content);
        } else
        {
            settings.content.forEach(x =>
            {
                if (typeof x == "string")
                    card.append(this.components.format(x));
                else
                    card.append(x);
            });
        }
        if (settings.buttons)
        {
            let buttonlist = document.createElement("buttonlist");
            card.append();
            settings.buttons.forEach(x =>
            {
                const button = document.createElement('button');
                button.onclose = x.onclick;
                button.classList.add(x.color);
                button.innerHTML = x.text;
                buttonlist.append(button)
            });
            card.append(buttonlist);
        }
        element.append(card);
        this.ele.append(element);
        this.last = element;
        return this;
    }
}