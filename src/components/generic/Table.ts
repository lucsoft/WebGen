import { Component } from "../../types.ts";
import { headless } from "../cards/headlessCard.ts";
import { Card } from "./Card.ts";
import { Icon } from "./Icon.ts";
import { PlainText } from "./PlainText.ts";
import { Grid } from "./Stacks.ts";
export type ColumEntry<Data, Entry = keyof Data> = [ id: string | Entry, size: string, render: (data: Data, index: number) => Component ];

export class TableComponent<Data> extends Component {
    hasDelete = false;
    #columns: ColumEntry<Data>[];
    #data: Data[];

    constructor(_columns: ColumEntry<Data>[], data: Data[]) {
        super();
        this.#columns = _columns;
        this.#data = data;
        this.refresh();
    }

    setDelete(action: (entry: Data) => void | Promise<void>) {
        this.#columns.push([ "", "max-content",
            (data) => Icon("delete").onClick(async () => {
                await action(data);
                this.refresh();
            })
        ]);
        this.refresh();
        return this;
    }

    refresh() {
        const data = Card(headless(
            Grid(
                ...this.#columns.map(([ id ]) => PlainText(id.toString()).addClass("title")),

                ...this.#data.map((x): Component[] => [
                    ...this.#columns.map(([ _id, _size, render ], index) => render(x, index))
                ]).flat(),
            )
                .setAlign("center")
                .setGap("5px 13px")
                .setWidth("100%")
                .setRawColumns(`${this.#columns.map(([ _, data = "max-content" ]) => data).join(" ")}`)
        )).addClass("wtable").draw();
        this.wrapper = data;
    }
}
export function Table<Data>(_columns: ColumEntry<Data>[], data: Data[]) {
    return new TableComponent(_columns, data);
}