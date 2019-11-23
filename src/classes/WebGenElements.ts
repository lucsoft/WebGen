import { ElementModifyer } from './ElementModify';
import { ElementResponse } from './ElementsResponse';
import { Style } from './Style';

function hasTouch()
{
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
}
class Tiny
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
    enableDrag(id: string)
    {
        let drag = false;
        throw "NICHT DA";
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
    text?: string;
    id: string;

}


/**
* TODO: Add Uploader
*       Add appList
*       Add imgList
*/
export class WebGenElements
{
    private ele: HTMLElement;
    tiny: Tiny = new Tiny();
    style: Style;
    constructor(element: HTMLElement, style: Style)
    {
        this.ele = element;
        this.style = style;
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


    bigTitle(
        settings: {
            img?: string | undefined,
            title: string,
            subtitle?: string | "",
            spaceingTop?: string | undefined
        })
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
            if (settings.title.indexOf("y") != -1 || settings.title.indexOf("j") != -1 || settings.title.indexOf("q") != -1 || settings.title.indexOf("p") != -1)
            {
                element.innerHTML = `${settings.title}${settings.subtitle ? `<span class="subtitlew" style="margin-left: 0;margin-top: 0.5rem;">${settings.subtitle}</span>` : ''}`;
            } else
            {
                element.innerHTML = `${settings.title}${settings.subtitle ? `<span class="subtitlew" style="margin-left: 0;">${settings.subtitle}</span>` : ''}`;
            }
        }
        if (settings.spaceingTop != undefined)
        {
            element.setAttribute("style", "margin-top: " + settings.spaceingTop);
        }
        this.ele.appendChild(element);
        return new ElementResponse(this, element);
    }

    note(settings: { type: "home" | "fire" | "error" | "warn" | "developer", text: string, maxWidth?: string })
    {
        let element = document.createElement("span");
        element.id = this.getID();
        element.classList.add("note", settings.type);
        element.setAttribute("style", "display:block");
        element.innerHTML = settings.text;
        if (settings.maxWidth)
            element.style.maxWidth = settings.maxWidth;
        this.ele.appendChild(element);

        return new ElementResponse(this, element);
    }

    player(settings: { small: boolean, img: string, onInput: (type: "play" | "pause" | "next" | "previous" | "search", args: string) => any })
    {
        console.error("player currently now working");

        let element = document.createElement("audioPlayer");
        return new ElementResponse(this, element);

        if (settings.small == true)
        {
            element.classList.add("small");
        }
        element.id = this.getID();
        element.innerHTML = `<div class="overlay"><img src=""><input class="search" placeholder="Search a Song"></input><div class="controler"><i onmouseup="this.classList.remove('clicked')" onmousedown="this.classList.add('clicked')" class="material-icons-round">fast_rewind</i><i onmouseup="this.classList.remove('clicked')" onmousedown="this.classList.add('clicked')" class="material-icons-round">pause</i><i onmouseup="this.classList.remove('clicked')" onmousedown="this.classList.add('clicked')" class="material-icons-round">fast_forward</i></div><span class="title" id="playertitle"><span class="subtitle"></span></span><span class="playing">PLaying on Spotify</span><span class="notplaying">Nothing PLaying</span><span class="progress"></span></div><img src="${settings.img}">`;
        this.ele.appendChild(element);
        let buttons: HTMLCollection = this.ele.children[ 0 ].children[ 2 ].children;
        buttons[ 0 ].addEventListener("click", () =>
        {
            if (buttons[ 1 ].innerHTML == "play_arrow")
            {
                buttons[ 1 ].innerHTML = "pause";
                settings.onInput("play", "");
            }
            settings.onInput("previous", "");
        });
        buttons[ 1 ].addEventListener("click", () =>
        {
            if (buttons[ 1 ].innerHTML == "play_arrow")
            {
                settings.onInput("play", "");
            } else if (buttons[ 1 ].innerHTML == "pause")
            {
                settings.onInput("pause", "");
            }
        });
        buttons[ 2 ].addEventListener("click", () =>
        {
            if (buttons[ 1 ].innerHTML == "play_arrow")
            {
                buttons[ 1 ].innerHTML = "pause";
                settings.onInput("play", "");
            }
            settings.onInput("next", "");
        });
        let elmnt = <HTMLInputElement>this.ele.children[ 0 ];
        let elmnt2 = <HTMLInputElement>elmnt.children[ 1 ];

        let search: HTMLInputElement = elmnt2;
        search.addEventListener("keyup", (ev: KeyboardEvent) =>
        {
            if (ev.key == "Enter")
            {
                search.value = "";
                settings.onInput("search", search.value);
            }
        });
        return new ElementResponse(this, element);
    }


    cardButtons(settings: {
        small?: boolean,
        columns?: "auto" | "1" | "2" | "3" | "4" | "5",
        maxWidth?: string | "defaut",
        list: {
            title: string,
            value?: string,
            active?: boolean,
            id: string,
            onClick?: (toggleState: (state: string) => void, currentState: boolean, title: HTMLSpanElement, element: HTMLElement, id: string) => void
        }[]
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
            var state = e.active || false;
            card.innerHTML = `<span class="title">${e.title}</span>${e.value != undefined ? `<span class="value">${e.value}</span>` : ''}`;
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
                        e.onClick((text) =>
                        {
                            if (value)
                                (value as HTMLSpanElement).innerText = text;
                            card.classList.toggle('active');
                            state = !state;
                            if (hasTouch())
                            {
                                card.style.animation = "clickedM 250ms cubic-bezier(0.35, -0.24, 0, 1.29)";
                                setTimeout(() => { card.style.animation = ""; }, 500);
                            }
                        }, state, title as HTMLSpanElement, card, e.id);
                }
            }
            else
            {
                card.onclick = () => card.classList.toggle('active');
            }
            element.append(card);
        });
        this.ele.append(element);
        return new ElementResponse(this, element);
    }

    cards(settings: { small: boolean, hidden: boolean, columns: "auto" | "1" | "2" | "3" | "4" | "5", maxWidth?: string | "default", cards: { title: string, id: string, subtitle: string | false }[] })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        if (settings.small)
        {
            element.classList.add("small");
        }
        if (settings.hidden)
        {
            element.classList.add("hidden");
        }
        if (settings.maxWidth != undefined)
        {
            element.classList.add("max-width");
        }
        if (settings.maxWidth != "default")
        {
            element.setAttribute("style", "max-width:" + settings.maxWidth);
        }
        element.classList.add("grid_columns_" + settings.columns);
        settings.cards.forEach((e) =>
        {
            element.innerHTML += `<card id="${e.id}" class="lline disablehover ${e.subtitle != false ? "subtitle" : ""}"><span class="title">${e.title}</span>${e.subtitle != false ? `<span class="subtitle">${e.subtitle}</span>` : ""}</card>`;
        });
        this.ele.append(element);
        return new ElementResponse(this, element);
    }

    /**
     * What theme? just use modern
     */
    splitView(settings: {
        theme: "list" | "modern" | "one" | "auto";
        left: (ElementResponse | HTMLElement)[],
        right: (ElementResponse | HTMLElement)[],
        nomargin?: boolean,
        defaultContentPadding?: boolean,
        sidebarIsList?: boolean,
        maxWidth?: string | "default"
    })
    {
        let element = document.createElement('splitView');
        element.classList.add(settings.theme == "modern" ? 'm' : settings.theme);
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
            if (x instanceof ElementResponse)
                sidebar.append(x.modify.element)
            else
                sidebar.append(x)
        });
        settings.right.forEach((x) =>
        {
            if (x instanceof ElementResponse)
                content.append(x.modify.element)
            else
                content.append(x)
        });
        element.append(sidebar);
        element.append(content);
        this.ele.append(element);
        return new ElementResponse(this, element);
    }

    customElement(settings: {
        element: HTMLElement
    })
    {
        return new ElementResponse(this, settings.element);
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
        return new ElementResponse(this, element);
    }
    title(settings: {
        title: string,
        subtitle?: string
    })
    {
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
            return new ElementResponse(this, element);
        } else
        {
            let element = document.createElement("h2");
            element.id = this.getID();
            element.innerHTML = settings.title;
            this.ele.append(element);
            return new ElementResponse(this, element);
        }

    }

    search(settings: {
        type: "smart" | "default",
        maxWidth?: string | "default",
        onclose?: () => any,
        placeholder?: string,
        notfound?: string,
        onsearch?: (text: string) => any,
        drawList?: (input: string) => any,
        allowed?: { donwload?: boolean, edit?: boolean, remove?: boolean },
        actions?: { click?: (arg: string) => any, download?: (arg: string) => any, edit?: (arg: string) => any, remove: (arg: string) => any },
        index: SearchEntry[]
    })
    {
        let element = document.createElement("cardlist");
        element.id = this.getID();
        let lastsearch = "";
        element.classList.add("grid_columns_1");
        if (settings.maxWidth != undefined)
        {
            element.classList.add("max-width");
        }
        if (settings.maxWidth != "default" && settings.maxWidth != undefined)
        {
            element.style.maxWidth = settings.maxWidth;
        }
        let card = document.createElement("card");
        card.classList.add("search", "disablehover");
        let input: HTMLInputElement = document.createElement("input");
        let ul: HTMLUListElement = document.createElement("ul")
        input.placeholder = settings.placeholder || "Search...";
        let icon = this.getMaterialIcon("close");

        icon.onclick = () => settings.onclose;


        let list: SearchEntry[] = [];
        input.onkeyup = (d: KeyboardEvent) =>
        {
            if (d.key == "Enter")
            {
                if (ul.children.item.length == 1)
                {
                    let element = <HTMLButtonElement>ul.children[ 0 ];
                    if (element == null)
                    {
                        return;
                    }
                    element.click();
                }

            }
            if (lastsearch == input.value) return;
            lastsearch = input.value;
            if (settings.type == "smart" && settings.index)
            {
                let smart = input.value.split(` `);
                let tags: string[] = [];
                let name = "";
                smart.forEach(e =>
                {
                    if (e.startsWith("#") || e.startsWith("!"))
                    {
                        tags.push(e);
                    } else
                    {
                        name += " " + e;
                    }
                });
                name = name.slice(1);
                list = settings.index;
                tags.forEach(e =>
                {

                    if (e.startsWith("#"))
                    {
                        list = list.filter(x => x.tags ? x.tags.indexOf(e.slice(1)) != -1 : false);
                    } else if (e.startsWith("!"))
                    {
                        list = list.filter(x => x.tags ? x.tags.indexOf(e.slice(1)) == -1 : false);
                    }
                    if (list.length == 0)
                    {
                        return;
                    }
                });

                list = list.filter(x => x.name.toLowerCase().includes(name.toLowerCase()));
            } else
            {
                list = settings.index.filter(x => x.name.toLowerCase().includes(input.value.toLowerCase()));
                console.log("r");
            }

            ul.innerHTML = "";
            list.forEach(x =>
            {
                let tags = "";
                if (x.tags != undefined)
                {
                    x.tags.filter(x => tags += `<span class="tag">${x}</span>`)
                }
                let li = document.createElement("li");
                li.onclick = () =>
                {
                    if (settings.actions)
                        settings.actions.click ? settings.actions.click(x.id) : undefined;
                };
                li.innerHTML = `<left>${(x.icon) ? `<img onerror="if(!this.src.endsWith('#test#test')) {this.src += '#test';} else {this.remove()} " src="${x.icon}">` : ""}${x.name}</left><right>${x.category ? `<span class="tag category">${x.category}</span>` : ""}${x.text != undefined ? x.text : ""}${tags}${settings.allowed && settings.allowed.donwload == true ? `<i id="download${x.id}" class="material-icons-round">get_app</i>` : ""}${(settings.allowed && settings.allowed.edit == true) ? `<i id="edit${x.id}" class="material-icons-round">edit</i>` : ""}${(settings.allowed && settings.allowed.remove == true) ? `<i id="remove${x.id}" class="material-icons-round">delete</i>` : ""}</right>`;
                let downloadE = document.getElementById("download" + x.id);
                let editE = document.getElementById("edit" + x.id);
                let removeE = document.getElementById("edit" + x.id);
                if (downloadE != undefined)
                {
                    downloadE.onclick = () => settings.actions ? settings.actions.download : undefined;
                }
                if (editE != undefined)
                {
                    editE.onclick = () => settings.actions ? settings.actions.edit : undefined;
                }
                if (removeE != undefined)
                {
                    removeE.onclick = () => settings.actions ? settings.actions.remove : undefined;
                }
                ul.appendChild(li);
            });
        };
        card.appendChild(icon);
        card.appendChild(input);
        card.appendChild(ul);
        element.appendChild(card);
        this.ele.appendChild(element);
        return new ElementResponse(this, element);
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

        return new ElementResponse(this, element);
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
        return new ElementResponse(this, element);
    }

    window(settings: {
        maxWidth?: "default" | string,
        title?: string,
        buttons?: {
            color: string,
            text: string,
            onclick: string
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
            card.append(this.tiny.format(settings.content));
        } else if (settings.content instanceof HTMLElement)
        {
            card.append(settings.content);
        } else
        {
            settings.content.forEach(x =>
            {
                if (typeof x == "string")
                    card.append(this.tiny.format(x));
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
                buttonlist.append(`<button class="${x.color}" onclick="${x.onclick}">${x.text}}</button>`)
            });
            card.append(buttonlist);
        }
        element.append(card);
        this.ele.append(element);
        return new ElementResponse(this, element);
    }
}