import { Component } from "../Component.ts";
import { Refable, Reference, asRef } from "../State.ts";
import { Label } from "./Label.ts";
import { Sheet, SheetsStackComponent } from "./Sheet.ts";
import { Grid } from "./Stacks.ts";

export function SheetDialog(sheetRegistry: SheetsStackComponent, title: Refable<string>, ...content: Component[]) {
    const isOpen = asRef(false);

    const sheet = Sheet(
        Grid(
            Grid(
                Label(title)
                    .addClass("wsheet-title")
                    .setTextSize("3xl")
                    .setFontWeight("bold")
            )
                .setAlign("end")
                .setHeight("80px"),
            ...content
        )
            .setGap()
            .setMargin("15px")
    );


    isOpen.listen((open, oldValue) => {
        if (open)
            sheetRegistry.add(sheet);
        else if (oldValue)
            sheetRegistry.remove(sheet);
    });


    return {
        open: () => isOpen.setValue(true),
        close: () => isOpen.setValue(false),
        setId: (id: string) => sheet.setId(id),
        setOnClose: (onClose: () => void) => sheet.setOnClose(onClose),
        setCanClose: (pointer: Reference<boolean>) => sheet.setCanClose(pointer),
    };
}