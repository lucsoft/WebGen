import { deferred } from "https://deno.land/std@0.206.0/async/deferred.ts";
import { Component } from "../Component.ts";
import { Pointer, asPointer, refMerge } from "../State.ts";
import { isMobile } from "../mobileQuery.ts";
import './Sheet.css';

class SheetComponent extends Component {

    constructor(public readonly offset: Pointer<number>, public readonly kind: Component) {
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
}

class SheetsComponent extends Component {
    private readonly sheets: Pointer<SheetComponent[]> = asPointer([]);

    constructor(component: Component, private readonly mobileTrigger: Pointer<boolean>) {
        super();
        this.onClick(() => {
            this.remove(this.sheets.getValue().at(-1)!);
        });
        this.addClass("wstacking-sheets");
        this.addClass(mobileTrigger.map(it => it ? "mobile-variant" : "desktop-variant"));

        this.add(new SheetComponent(asPointer(0), component));
    }

    add(sheet: SheetComponent) {
        this.sheets.setValue([ ...this.sheets.getValue(), sheet ]);
        const index = this.sheets.getValue().length - 1;

        const element = sheet.draw();
        element.style.zIndex = `${(index) + 10}`;

        const sheetVisible = this.sheets.map(it => it.includes(sheet));
        const sheetOnTop = this.sheets.map(it => it.at(-1) === sheet);

        sheet.addClass(sheetVisible.map(it => it ? "shown" : "hidden"));
        sheet.addClass(sheetOnTop.map(it => it ? "on-top" : "not-on-top"));

        sheet.addClass(refMerge({ sheets: this.sheets }).map(({ sheets }) => (sheets.length - 1) > 0 ? "background" : "no-background"));

        this.mobileTrigger.map(mobile => {
            element.style.setProperty("--sheet-index", `${index > 0 && !mobile ? index - 1 : index}`);
        });

        sheet.onClick((ev) => {
            ev.stopPropagation();
        });

        this.sheets.map(it => it.length).listen(it => {
            if (it && it > 0) {
                element.style.setProperty("--sheet-reverse-index", `${it - index - 1}`);
            }
            else
                element.style.setProperty("--sheet-reverse-index", `0`);
        });

        this.wrapper.append(element);
        return this;
    }

    async remove(sheet: SheetComponent) {
        // find index
        const index = this.sheets.getValue().indexOf(sheet);
        const animationEnded = deferred();

        this.wrapper.children[ index ].addEventListener("animationend", () => animationEnded.resolve());

        this.sheets.setValue(this.sheets.getValue().filter(it => it !== sheet));

        await animationEnded;

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

export const Sheets = (sheet: Component, mobileTrigger: Pointer<boolean> = isMobile) => new SheetsComponent(sheet, mobileTrigger);

export const Sheet = (content: Component) => new SheetComponent(asPointer(0), content);
