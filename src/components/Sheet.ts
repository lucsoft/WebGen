import { Component } from "../Component.ts";
import { Reference, asRef } from "../State.ts";
import { isMobile } from "../mobileQuery.ts";
import './Sheet.css';

export class SheetComponent extends Component {
    onClose = asRef<() => void>(() => { });
    canClose = asRef<boolean>(true);

    constructor(public readonly offset: Reference<number>, public readonly kind: Component) {
        super();
        this.addClass("wsheet");
        this.wrapper.append(kind.draw());
    }

    setWidth(size: string): this {
        this.wrapper.style.setProperty("--sheet-desktop-width", size);
        return this;
    }

    setHeight(size: string): this {
        this.wrapper.style.setProperty("--sheet-desktop-height", size);
        return this;
    }

    setOnClose(onClose: () => void): this {
        this.onClose.setValue(onClose);
        return this;
    }

    setCanClose(canClose: Reference<boolean>): this {
        canClose.listen(it => this.canClose.setValue(it));
        return this;
    }
}

export class SheetsStackComponent extends Component {
    readonly #sheets = asRef<SheetComponent[]>([]);

    constructor(private readonly mobileTrigger: Reference<boolean>) {
        super();
        this.onClick(() => {
            const sheet = this.#sheets.getValue().at(-1)!;
            if (!sheet.canClose.getValue())
                return;
            sheet.onClose.getValue()();
            this.remove(sheet);
        });
        this.addClass("wstacking-sheets");
        this.addClass(mobileTrigger.map(it => it ? "mobile-variant" : "desktop-variant"));
    }

    add(sheet: SheetComponent) {
        this.#sheets.addItem(sheet);
        const index = this.#sheets.getValue().length - 1;

        const element = sheet.draw();
        element.style.zIndex = `${(index) + 10}`;

        const sheetVisible = this.#sheets.map(it => it.includes(sheet));
        const sheetOnTop = this.#sheets.map(it => it.at(-1) === sheet);

        sheet.addClass(sheetVisible.map(it => it ? "shown" : "hidden"));
        sheet.addClass(sheetOnTop.map(it => it ? "on-top" : "not-on-top"));

        sheet.addClass(this.#sheets.map((sheets) => (sheets.length - 1) > 0 ? "background" : "no-background"));

        this.mobileTrigger.map(mobile => {
            element.style.setProperty("--sheet-index", `${index > 0 && !mobile ? index - 1 : index}`);
        });

        sheet.onClick((ev) => {
            ev.stopPropagation();
        });

        this.#sheets.map(it => it.length).listen(it => {
            if (it && it > 0) {
                element.style.setProperty("--sheet-reverse-index", `${it - index - 1}`);
            }
            else
                element.style.setProperty("--sheet-reverse-index", `0`);
        });

        this.wrapper.append(element);
        return this;
    }

    setDefault(component: Component) {
        this.add(new SheetComponent(asRef(0), component));
    }

    async remove(sheet: SheetComponent) {
        const index = this.#sheets.getValue().indexOf(sheet);
        const animationEnded = Promise.withResolvers<void>();

        this.wrapper.children[ index ].addEventListener("animationend", () => animationEnded.resolve());

        this.#sheets.setValue(this.#sheets.getValue().filter(it => it !== sheet));

        await animationEnded.promise;

        this.wrapper.children[ index ].remove();

        return this;
    }

    setSheetWidth(size: string): this {
        this.wrapper.style.setProperty("--sheet-desktop-width", size);
        return this;
    }

    setSheetHeight(size: string): this {
        this.wrapper.style.setProperty("--sheet-desktop-height", size);
        return this;
    }
}

export const SheetsStack = (mobileTrigger: Reference<boolean> = isMobile) => new SheetsStackComponent(mobileTrigger);

export const Sheet = (content: Component) => new SheetComponent(asRef(0), content);
