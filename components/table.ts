import { alwaysRef, asRef, asWebGenComponent, Color, css, Grid, HTMLComponent, Label, WriteSignal, type Component, type Reference } from "../core/mod.ts";
import { Checkbox, type CheckboxValue } from "./form/checkbox.ts";


export type TableDefinition<T extends object[]> = {
    [ K in keyof T[ number ] ]?: { titleRenderer?: () => Component, cellRenderer?: (data: Readonly<T[ number ][ K ]>) => Component, columnWidth?: string; }
};

@asWebGenComponent("table")
export class TableComponent<T extends object[]> extends HTMLComponent {
    #hoveringActive = asRef(false);
    #rowClickActive = asRef<(() => void) | undefined>(undefined);
    #selectionActive = asRef<(() => void) | undefined>(undefined);
    #selectedIndexes = asRef<number[]>([]);
    #headerSelection = asRef<CheckboxValue>(false);
    #inputBg = new Color("var(--wg-table-background-color, var(--wg-primary))");
    #currentlyHoveredRow = asRef<number | undefined>(undefined);
    #innerScroll = asRef(false);

    constructor(data: Reference<T>, typeDefRef: Reference<TableDefinition<T>>) {
        super();

        const items = asRef<Component[]>([]);
        const columSizes = asRef("");

        this.addListen(() => {
            const columns = Array.from(new Set(data.value.flatMap(item => Object.keys(item) as (keyof T[ number ])[])).values());
            const typeDef = typeDefRef.value;
            columSizes.value = columns.map(column => typeDef[ column ]?.columnWidth ?? "max-content").join(" ");
            items.value = [
                ...columns.map((column, index) =>
                    Grid(
                        alwaysRef(index === 0 && this.#selectionActive.value ? [
                            Checkbox(this.#headerSelection)
                                .onClick(() => {
                                    if (this.#headerSelection.value === false) {
                                        this.#headerSelection.value = true;
                                        this.#selectedIndexes.value = data.value.map((_, index) => index);
                                    } else {
                                        this.#headerSelection.value = false;
                                        this.#selectedIndexes.value = [];
                                    }
                                    this.#selectionActive.value?.();
                                })
                        ] : []),
                        typeDef[ column ]?.titleRenderer?.() ?? Label(column.toString())
                    )
                        .setGap(this.#selectionActive.value && index === 0 ? "10px" : "8px")
                        .setAutoFlow("column")
                        .setJustifyContent("start")
                        .setHeight("35px")
                        .setAlignContent("center")
                        .addStyle(css`
                            :host {
                                position: sticky;
                                top: ${this.#innerScroll.value ? "0" : "10px"};
                                background-color: ${this.#inputBg.mix(Color.transparent, 85)};
                                padding: 0 ${this.#selectionActive.value && index === 0 ? "6px" : "14px"};
                                border-radius: ${index === 0 ? "9px 0 0 9px" : index === columns.length - 1 ? "0 9px 9px 0" : "0"};
                                box-sizing: border-box;
                                backdrop-filter: blur(10px);
                                z-index: 1;
                            }
                            @supports (text-box: trim-both cap alphabetic) {
                                :host {
                                    line-height: unset;
                                    text-box: trim-both cap alphabetic;
                                }
                            }
                        `)
                ),
                ...data.value.flatMap((item, rowIndex) => columns.flatMap((column, columnIndex) =>
                    Grid(
                        alwaysRef(columnIndex === 0 && this.#selectionActive.value ? [
                            Checkbox(this.#selectedIndexes.map(indexes => indexes.includes(rowIndex) as CheckboxValue) as WriteSignal<CheckboxValue>)
                                .onClick(() => {
                                    if (this.#selectedIndexes.value.includes(rowIndex)) {
                                        this.#selectedIndexes.value = this.#selectedIndexes.value.filter(i => i !== rowIndex);
                                    } else {
                                        this.#selectedIndexes.value = [ ...this.#selectedIndexes.value, rowIndex ];
                                    }
                                    if (this.#selectedIndexes.value.length === 0) {
                                        this.#headerSelection.value = false;
                                    } else if (this.#selectedIndexes.value.length !== data.value.length) {
                                        this.#headerSelection.value = "intermediate";
                                    } else {
                                        this.#headerSelection.value = true;
                                    }
                                    this.#selectionActive.value?.();
                                })
                        ] : []),
                        typeDef[ column ]?.cellRenderer?.(item[ column as keyof object ]) ?? Label(item[ column as keyof object ])
                    )
                        .setGap(this.#selectionActive.value && columnIndex === 0 ? "10px" : "8px")
                        .setAutoFlow("column")
                        .setJustifyContent("start")
                        .addClass("row")
                        .setAttribute("data-row-index", rowIndex.toString())
                        .setAttribute("hover", this.#currentlyHoveredRow.map(hoverIndex => hoverIndex === rowIndex ? "" : undefined))
                        .setAttribute("clickable", this.#rowClickActive.map((active) => active ? "" : undefined))
                        .setHeight("35px")
                        .setAlignContent("center")
                        .addStyle(css`
                            :host {
                                padding: 0 ${this.#selectionActive.value && columnIndex === 0 ? "6px" : "14px"};
                                border-radius: ${columnIndex === 0 ? "9px 0 0 9px" : columnIndex === columns.length - 1 ? "0 9px 9px 0" : "0"};
                                box-sizing: border-box;
                                ${rowIndex % 2 === 1 ? `background-color: ${this.#inputBg.mix(Color.transparent, 95)}` : ""};
                                transition: translate 250ms ease;
                                min-width: max-content;
                            }
                            :host([hover]) {
                                background-color: ${this.#inputBg.mix(Color.transparent, 90)};
                            }
                            :host([clickable]) {
                                cursor: pointer;
                            }
                            :host([clickable][hover]) {
                                translate: 0px -2px;
                                backdrop-filter: blur(50px);
                            }
                        `)
                )
                )
            ];
        });

        const table = Grid(
            items
        )
            .setTemplateColumns(columSizes)
            .draw();

        this.shadowRoot?.adoptedStyleSheets.push(css`
            :host([inner-scroll]) {
                overflow: auto;
            }
        `);

        this.make().setAttribute("inner-scroll", this.#innerScroll.map(inner => inner ? "" : undefined));

        // mouse move
        this.useEventListener(table, "mousemove", (event) => {
            if (this.#hoveringActive.value === false) return;
            const row = event.composedPath().find(element => element instanceof HTMLElement && element.classList.contains("row"));
            if (!row || !(row instanceof HTMLElement)) {
                this.#currentlyHoveredRow.value = undefined;
                return;
            };
            this.#currentlyHoveredRow.value = Number(row.getAttribute("data-row-index"));
        });

        this.useEventListener(table, "mouseleave", () => {
            this.#currentlyHoveredRow.value = undefined;
        });

        this.useEventListener(table, "click", () => {
            this.#rowClickActive.value?.();
        });

        this.shadowRoot!.append(table);
    }

    override make() {
        const obj = {
            ...super.make(),
            setHoveringActive: () => {
                this.#hoveringActive.value = true;
                return obj;
            },
            onRowClick: (action: (rowId: number) => void) => {
                this.#hoveringActive.value = true;
                this.#rowClickActive.value = () => action(this.#currentlyHoveredRow.value!);
                return obj;
            },
            makeScrollable: () => {
                this.#innerScroll.value = true;
                return obj;
            },
            onSelection: (action: (selectedIndexes: number[]) => void) => {
                this.#selectionActive.value = () => {
                    action(this.#selectedIndexes.value);
                };
                return obj;
            },
        };
        return obj;
    }
}

export function Table<T extends object[]>(data: Reference<T>, typeDefRef: Reference<TableDefinition<T>> = alwaysRef({})) {
    return new TableComponent(data, typeDefRef).make();
}