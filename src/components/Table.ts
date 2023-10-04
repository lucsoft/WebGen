import { Component } from "../Component.ts";
import { MIcon } from "../icons/MaterialIcons.ts";
import { Card } from "./Card.ts";
import { Label } from "./Label.ts";
import { Grid } from "./Stacks.ts";
import './Table.css';
export type ColumEntry<Data> = [ id: string, size: string, render: (data: Data, index: number) => Component ];

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

    setDelete(action: (entry: Data, index: number) => void | Promise<void>, icon = () => MIcon("delete")) {
        this.#columns.push([ "", "max-content",
            (data, index) => icon().onClick(async () => {
                await action(data, index);
                this.refresh();
            })
        ]);
        this.refresh();
        return this;
    }

    refresh() {
        const data = Card(
            Grid(
                ...this.#columns.map(([ id ]) => Label(id.toString()).addClass("title")),

                ...this.#data.map((x, index): Component[] => [
                    ...this.#columns.map(([ _id, _size, render ]) => render(x, index))
                ]).flat(),
            )
                .setAlign("center")
                .setGap("5px 13px")
                .setWidth("100%")
                .setRawColumns(`${this.#columns.map(([ _, data = "max-content" ]) => data).join(" ")}`)
        ).addClass("wtable").draw();
        this.wrapper = data;
    }
}
export function Table<Data>(_columns: ColumEntry<Data>[], data: Data[]) {
    return new TableComponent(_columns, data);
}