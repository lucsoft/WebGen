import { css, Grid, Label, type Refable } from "../../core/mod.ts";
import { MaterialIcon, SecondaryButton } from "../mod.ts";
import type { Sheets } from "./sheets.ts";

export function SheetHeader(label: Refable<string>, sheets: ReturnType<typeof Sheets>) {
    return Grid(
        Label(label)
            .setTextSize("3xl")
            .setFontWeight("bold")
            .setMargin("30px 30px 0 0"),
        SecondaryButton("")
            .addPrefix(MaterialIcon("close"))
            .onClick(() => sheets.removeOne())
            .addStyle(css`
                :host {
                    --wg-button-text-padding: 0;
                    --wg-button-padding: 0 6px;
                }
            `)
    )
        .setAutoFlow("column")
        .setJustifyContent("space-between");
}