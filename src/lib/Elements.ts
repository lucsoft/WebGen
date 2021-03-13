import { span } from "../components";
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
    none = () => new WebGenElements(document.createElement("article"));

    /**
     * Display in DOM
     */
    body(options?: { maxWidth?: string }): WebGenElements
    {
        var article = document.createElement("article");
        document.body.append(article);
        if (options?.maxWidth)
        {
            article.classList.add('maxWidth');
            article.style.maxWidth = options.maxWidth;
        }
        return new WebGenElements(article);
    }
    notify(test: string)
    {
        const notifcation = span(test)
        setTimeout(() => notifcation.remove(), 6010);
        this.staticNotify.append(notifcation);
    }

    fixedWindow(show: boolean, clear: boolean = false)
    {
        this.staticFixedWindow.style.display = show ? "block" : "none";
        if (clear)
            this.staticFixedWindow.innerHTML = "";
        return new WebGenElements(this.staticFixedWindow);
    }

    custom = (element: HTMLElement, options?: { maxWidth?: string }) =>
    {
        if (options?.maxWidth)
        {
            element.classList.add('maxWidth');
            element.style.maxWidth = options.maxWidth;
        }
        return new WebGenElements(element)
    };

    clear(search: HTMLElement | string)
    {
        if (typeof search === "string")
        {
            const searchE = document.querySelector(search);
            if (searchE) searchE.innerHTML = "";
        }
        else
            search.innerHTML = ""
    }

}