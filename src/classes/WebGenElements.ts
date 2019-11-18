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
        var drag = false;
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
        var i = document.createElement("i");
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
        var element = document.createElement("span");
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
        var element = document.createElement("span");
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

        var element = document.createElement("audioPlayer");
        return new ElementResponse(this, element);

        if (settings.small == true)
        {
            element.classList.add("small");
        }
        element.id = this.getID();
        element.innerHTML = `<div class="overlay"><img src=""><input class="search" placeholder="Search a Song"></input><div class="controler"><i onmouseup="this.classList.remove('clicked')" onmousedown="this.classList.add('clicked')" class="material-icons-round">fast_rewind</i><i onmouseup="this.classList.remove('clicked')" onmousedown="this.classList.add('clicked')" class="material-icons-round">pause</i><i onmouseup="this.classList.remove('clicked')" onmousedown="this.classList.add('clicked')" class="material-icons-round">fast_forward</i></div><span class="title" id="playertitle"><span class="subtitle"></span></span><span class="playing">PLaying on Spotify</span><span class="notplaying">Nothing PLaying</span><span class="progress"></span></div><img src="${settings.img}">`;
        this.ele.appendChild(element);
        var buttons: HTMLCollection = this.ele.children[ 0 ].children[ 2 ].children;
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
        var elmnt = <HTMLInputElement>this.ele.children[ 0 ];
        var elmnt2 = <HTMLInputElement>elmnt.children[ 1 ];

        var search: HTMLInputElement = elmnt2;
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
            value: string,
            active: boolean,
            id: string,
            toggleElement?: (toggleState: (state: string) => void, state: HTMLSpanElement, title: HTMLSpanElement, element: HTMLElement, id: string) => void
        }[]
    })
    {
        var element = document.createElement("cardlist");
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
            var card = document.createElement("card");
            card.classList.add("cardButton");
            if (e.active)
            {
                card.classList.add('active');
            }
            card.id = e.id;
            card.innerHTML = `<span class="title">${e.title}</span><span class="value">${e.value}</span>`;
            if (e.toggleElement)
            {

                var title = card.querySelector('.title');
                var value = card.querySelector('.value');
                if (hasTouch())
                    card.classList.add('disablehover');

                card.onclick = () =>
                {
                    if (!hasTouch())
                    {
                        card.style.animation = "clicked 250ms cubic-bezier(0.35, -0.24, 0, 1.29)";
                        setTimeout(() => { card.style.animation = ""; }, 500);
                    }
                    if (e.toggleElement)
                        e.toggleElement((text) =>
                        {
                            if (value)
                                (value as HTMLSpanElement).innerText = text;
                            card.classList.toggle('active');
                            if (hasTouch())
                            {
                                card.style.animation = "clickedM 250ms cubic-bezier(0.35, -0.24, 0, 1.29)";
                                setTimeout(() => { card.style.animation = ""; }, 500);
                            }
                        }, title as HTMLSpanElement, value as HTMLSpanElement, card, e.id);
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
        var element = document.createElement("cardlist");
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

    title(settings: {
        title: string,
        subtitle?: string
    })
    {
        if (settings.subtitle)
        {
            var element = document.createElement("h2");
            element.id = this.getID();
            element.innerHTML = settings.title;
            this.ele.append(element);
            var element2 = document.createElement("h4");
            element2.innerHTML = settings.subtitle;
            this.ele.append(element2);
            var element3 = document.createElement("br");
            this.ele.append(element3);
            return new ElementResponse(this, element);
        } else
        {
            var element = document.createElement("h2");
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
        var element = document.createElement("cardlist");
        element.id = this.getID();
        var lastsearch = "";
        element.classList.add("grid_columns_1");
        if (settings.maxWidth != undefined)
        {
            element.classList.add("max-width");
        }
        if (settings.maxWidth != "default" && settings.maxWidth != undefined)
        {
            element.style.maxWidth = settings.maxWidth;
        }
        var card = document.createElement("card");
        card.classList.add("search", "disablehover");
        var input: HTMLInputElement = document.createElement("input");
        var ul: HTMLUListElement = document.createElement("ul")
        input.placeholder = settings.placeholder || "Search...";
        var icon = this.getMaterialIcon("close");

        icon.onclick = () => settings.onclose;


        var list: SearchEntry[] = [];
        input.onkeyup = (d: KeyboardEvent) =>
        {
            if (d.key == "Enter")
            {
                if (ul.children.item.length == 1)
                {
                    var element = <HTMLButtonElement>ul.children[ 0 ];
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
                var smart = input.value.split(` `);
                var tags: string[] = [];
                var name = "";
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
                var tags = "";
                if (x.tags != undefined)
                {
                    x.tags.filter(x => tags += `<span class="tag">${x}</span>`)
                }
                var li = document.createElement("li");
                li.onclick = () =>
                {
                    if (settings.actions)
                        settings.actions.click ? settings.actions.click(x.id) : undefined;
                };
                li.innerHTML = `<left>${(x.icon) ? `<img onerror="if(!this.src.endsWith('#test#test')) {this.src += '#test';} else {this.remove()} " src="${x.icon}">` : ""}${x.name}</left><right>${x.category ? `<span class="tag category">${x.category}</span>` : ""}${x.text != undefined ? x.text : ""}${tags}${settings.allowed && settings.allowed.donwload == true ? `<i id="download${x.id}" class="material-icons-round">get_app</i>` : ""}${(settings.allowed && settings.allowed.edit == true) ? `<i id="edit${x.id}" class="material-icons-round">edit</i>` : ""}${(settings.allowed && settings.allowed.remove == true) ? `<i id="remove${x.id}" class="material-icons-round">delete</i>` : ""}</right>`;
                var downloadE = document.getElementById("download" + x.id);
                var editE = document.getElementById("edit" + x.id);
                var removeE = document.getElementById("edit" + x.id);
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
        var element = document.createElement("center");
        element.id = this.getID();
        settings.list.forEach(x =>
        {
            var button = document.createElement("button");
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
            var br_mh = document.createElement("br");
            br_mh.classList.add("mobilehide");
            var br = document.createElement("br");
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
        var element = document.createElement("cardlist");
        element.classList.add('grid_columns_1', 'max-width');
        element.style.maxWidth = settings.maxWidth || "35rem";
        element.id = this.getID();

        var card = document.createElement("card");


        card.classList.add('popup');
        card.classList.add('login');
        var form = document.createElement("form");
        var span = document.createElement("span");
        span.classList.add("popup-title");
        span.innerHTML = settings.text || "Login";
        card.append(span);
        var url: HTMLInputElement = document.createElement("input");
        var email: HTMLInputElement = document.createElement("input");
        var password: HTMLInputElement = document.createElement("input");
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
        var span = document.createElement("span");
        span.classList.add("errormsg");
        var button = document.createElement("input");
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
        var element = document.createElement("cardlist");
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
        var card = document.createElement("card");
        if (settings.title)
        {
            var spantitle = document.createElement("span");
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
            var buttonlist = document.createElement("buttonlist");
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