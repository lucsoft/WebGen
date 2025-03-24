import { asWebGenComponent, Component } from "../components.ts";
import { alwaysRef, ref, Refable, Reference } from "../state.ts";
import { BoxComponent } from "./box.ts";

@asWebGenComponent("grid")
export class GridComponent extends BoxComponent {
    constructor(component: Reference<Component[] | Component> | Component, components: Component[]) {
        super(component, components);
        this.style.display = "grid";
    }

    override make() {
        const obj = {
            ...super.make(),

            setGap(gap: Refable<string> = "var(--wg-gap)") {
                obj.setCssStyle('gap', gap);
                return obj;
            },

            setTemplateColumns(template: Refable<string>) {
                obj.setCssStyle('gridTemplateColumns', template);
                return obj;
            },
            setDynamicColumns(minSize: Refable<number> = 6, max: Refable<string> = "1fr") {
                obj.setCssStyle('gridTemplateColumns', ref`repeat(auto-fit,minmax(${minSize}rem,${max}))`);
                return obj;
            },
            setEvenColumns(count: Refable<number>, size: string = "1fr") {
                obj.setCssStyle('gridTemplateColumns', alwaysRef(count).map(counted => `${size} `.repeat(counted)));
                return obj;
            },

            setAutoRow(row: Refable<string>) {
                obj.setCssStyle("gridAutoRows", row);
                return obj;
            },
            setAutoColumn(column: Refable<string>) {
                obj.setCssStyle("gridAutoColumns", column);
                return obj;
            },
            setAutoFlow(type: Refable<"column" | "row" | "row-reverse" | "column-reverse">) {
                obj.setCssStyle("gridAutoFlow", type);
                return obj;
            }
        };
        return obj;
    };
}

export function Grid(component: Reference<Component[] | Component> | Component, ...components: Component[]) {
    return new GridComponent(component, components).make();
}