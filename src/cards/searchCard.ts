import { CardTypes } from "../types/card";
import { HeadlessCard } from "./headlessCard";

export type SearchEntry = {
    name: string;
    icon?: string;
    tags?: string[];
    category?: string;
    suffix?: string;
    id: string;
}

export const enum SearchMode
{
    ShowBegin,
    HideBegin,
    HideWhenEmpty
}

export function searchCard(settings: {
    type: "smart" | "default",
    maxWidth?: string | "default",
    mode?: SearchMode
    placeholder?: string,
    notfound?: string,
    actions?: {
        close?: () => void,
        click?: (arg: SearchEntry) => void,
        download?: (arg: SearchEntry) => void,
        edit?: (arg: SearchEntry) => void,
        remove?: (arg: SearchEntry) => void
    },
    index: SearchEntry[],
    width?: number
}): HeadlessCard
{
    let search = document.createElement("div");
    search.classList.add("search");
    let input: HTMLInputElement = document.createElement("input");
    let ul: HTMLUListElement = document.createElement("ul")
    input.placeholder = settings.placeholder || "Search...";
    if (settings.actions?.close)
    {
        let icon = document.createElement("i");
        icon.classList.add("material-icons");
        icon.innerHTML = "close";
        icon.onclick = settings.actions?.close;
        search.append(icon);
    }

    let list: SearchEntry[] = [];
    let lastsearch = "";

    input.onkeyup = (d: KeyboardEvent) =>
    {
        if (d.key == "Enter")
        {
            if (ul.children.item.length == 1)
            {
                let element = <HTMLButtonElement | undefined>ul.children[ 0 ];
                element?.click();
            }

        }
        if (lastsearch == input.value) return;
        lastsearch = input.value;
        if (settings.mode === SearchMode.HideWhenEmpty && lastsearch === "")
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

    search.append(input);
    search.append(ul);

    if (settings.mode === SearchMode.ShowBegin)
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

    return {
        type: CardTypes.Headless,
        html: search,
        width: settings.width
    };
}
