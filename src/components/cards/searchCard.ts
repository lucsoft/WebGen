import { createElement, img, mIcon, span } from "../Components";
import { CommonCard } from "../../types/card";
import '../../css/search.webgen.static.css';

export type SearchEntry = {
    name: string;
    icon?: string;
    tags?: string[];
    category?: string;
    suffix?: string;
    id: string;
}

export const enum SearchMode {
    ShowBegin,
    HideBegin,
    HideWhenEmpty
}

export const searchCard = (settings: {
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
}): CommonCard => ({
    getSize: () => ({ height: undefined, width: settings.width }),
    draw: (card) => {

        let search = createElement("div");
        search.classList.add("search");
        let input = createElement("input") as HTMLInputElement;
        let ul = createElement("ul") as HTMLUListElement
        input.placeholder = settings.placeholder || "Search...";
        if (settings.actions?.close) {
            let icon = mIcon("close");
            icon.onclick = settings.actions?.close;
            search.append(icon);
        }

        let list: SearchEntry[] = [];
        let lastsearch = "";
        const reRenderElements = (x: SearchEntry) => {
            let tags: HTMLElement[] = [];
            x.tags?.filter((tag) => tags.push(span(tag, "tag")))
            let li = createElement("li");
            li.onclick = () => settings.actions?.click?.(x);
            const left = createElement("left");
            const right = createElement("right");
            if (x.icon) {
                const image = img(x.icon);
                image.loading = "lazy";
                left.append(image);
            }
            left.append(x.name);
            if (x.category) right.append(span(x.category, "tag", "category"));

            if (x.suffix) right.append(x.suffix);
            right.append(...tags);
            if (settings.actions?.download) {
                const download = mIcon("get_app");
                download.onclick = () => settings.actions?.download?.(x);
                right.append(download);
            }
            if (settings.actions?.edit) {
                const edit = mIcon("edit");
                edit.onclick = () => settings.actions?.edit?.(x);
                right.append(edit);
            }
            if (settings.actions?.remove) {
                const remove = mIcon("delete");
                remove.onclick = () => settings.actions?.remove?.(x);
                right.append(remove);
            }
            li.append(left);
            li.append(right);
            ul.append(li);
        }
        input.onkeyup = (d: KeyboardEvent) => {
            if (d.key == "Enter") {
                if (ul.children.item.length == 1) {
                    let element = <HTMLButtonElement | undefined>ul.children[ 0 ];
                    element?.click();
                }
            }
            if (lastsearch == input.value) return;
            lastsearch = input.value;
            if (settings.mode === SearchMode.HideWhenEmpty && lastsearch === "") {
                ul.innerHTML = "";
                return;
            }
            if (settings.type == "smart" && settings.index) {
                let smart = input.value.split(` `);
                let tags: string[] = [];
                let name = "";
                smart.forEach(e => {
                    if (e.startsWith("#") || e.startsWith("!"))
                        tags.push(e);
                    else
                        name += " " + e;

                });
                name = name.slice(1);
                list = settings.index;
                tags.forEach(e => {
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
            list.forEach(x => reRenderElements(x));
            if (ul.childNodes.length == 0 && settings.notfound !== undefined) {
                let li = createElement("li");
                li.onclick = () => settings?.actions?.click?.({ id: "notfound", name: "notfound" });
                li.classList.add("gray");
                li.innerText = settings.notfound;
                ul.append(li);
            }

        };

        search.append(input);
        search.append(ul);

        if (settings.mode === SearchMode.ShowBegin) {
            settings.index.forEach(x => reRenderElements(x));
        }

        card.append(search)
        return card
    }
});