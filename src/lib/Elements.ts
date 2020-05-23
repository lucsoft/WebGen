import { Style } from './Style';
import { WebGenElements } from './WebGenElements';

export class Elements
{
    style: Style;
    private staticNotify: HTMLElement;
    private staticFixedWindow: HTMLElement;
    constructor(style: Style)
    {
        this.style = style;
        const notify: HTMLElement | null = document.querySelector('#notify');
        if (notify)
            this.staticNotify = notify;
        else
        {
            const notifyNew = document.createElement('div');
            notifyNew.id = "notify";
            notifyNew.classList.add('notify');
            document.body.append(notifyNew);
            this.staticNotify = notifyNew;
        }

        const fixedWindow: HTMLElement | null = document.querySelector("#fixedWindow");
        if (fixedWindow)
            this.staticFixedWindow = fixedWindow;
        else
        {
            const staticFixedWindow = document.createElement("article");
            staticFixedWindow.id = "fixedWindow";
            staticFixedWindow.style.display = "none";
            document.body.append(staticFixedWindow);
            this.staticFixedWindow = staticFixedWindow;
        }
    }
    /**
     * Dont display in DOM
     */
    none(): WebGenElements
    {
        var article = document.createElement("article2");
        return new WebGenElements(article, this.style);
    }
    /**
     * Display in DOM
     */
    body(): WebGenElements
    {
        var article = document.createElement("article");
        document.body.append(article);
        return new WebGenElements(article, this.style);
    }
    notify(test: string)
    {
        const notifcation = document.createElement('span')
        setTimeout(() => notifcation.remove(), 6010);
        notifcation.innerText = test;
        this.staticNotify.append(notifcation);
    }

    fixedWindow(show: boolean, clear: boolean = false): WebGenElements
    {
        this.staticFixedWindow.style.display = show ? "block" : "none";
        if (clear)
            this.staticFixedWindow.innerHTML = "";
        return new WebGenElements(this.staticFixedWindow, this.style);
    }
    /**
     * Display in DOM as Custom Article
     */
    custom(article: HTMLElement): WebGenElements
    {
        return new WebGenElements(article, this.style);
    }

    clear(search: HTMLElement | string)
    {
        if (typeof search === "string")
        {
            const searchE = document.querySelector(search);
            if (searchE)
                searchE.innerHTML = "";
        }
        else
            search.innerHTML = ""

        console.log(typeof search);
    }

}