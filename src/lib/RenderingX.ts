import { createElement } from "../components/Components.ts";
import { PlainText } from "../components/generic/PlainText.ts";
import '../css/cards.webgen.static.css';
import '../css/dialog.webgen.static.css';

export class RenderingX {
    private staticNotify: HTMLElement;

    constructor() {
        const notify: HTMLElement | null = document.querySelector('#notify');
        if (notify)
            this.staticNotify = notify;
        else {
            const notifyNew = createElement('div');
            notifyNew.id = "notify";
            notifyNew.classList.add('notify');
            document.body.append(notifyNew);
            this.staticNotify = notifyNew;
        }
    }

    notify(test: string, keepOpenUntilDone?: () => Promise<undefined>) {
        const notifcation = PlainText(test).draw()
        if (keepOpenUntilDone === undefined)
            setTimeout(() => notifcation.remove(), 6010);
        else keepOpenUntilDone().then(() => notifcation.remove())
        this.staticNotify.append(notifcation);
    }
}