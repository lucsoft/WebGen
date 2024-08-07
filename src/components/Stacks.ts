import { Component } from "../Component.ts";
import { dropNullish } from "../Helper.ts";
import { ComponentArray } from "../types.ts";
import './Stacks.css';

class SpacerCompoent extends Component { }
export class AlignComponent extends Component {
    constructor(type: 'horizontal-stack' | 'vertical-stack', components: (Component | null)[]) {
        super();
        this.wrapper.classList.add(type);
        this.wrapper.append(...dropNullish(...components).map(x => x.draw()));
    }
    setGap(gap = "var(--gap)"): AlignComponent {
        this.wrapper.style.gap = gap;
        return this;
    }
}
export const Center = (...list: Component[]) => Horizontal(Spacer(), ...list, Spacer());
export const CenterV = (...list: Component[]) => Vertical(Spacer(), ...list, Spacer());
export const Spacer = () => new SpacerCompoent().addClass('spacer');
export const Horizontal = (...components: ComponentArray) => new AlignComponent("horizontal-stack", components.flat());
export const Vertical = (...components: ComponentArray) => new AlignComponent("vertical-stack", components.flat());
class GridComponent extends Component {
    constructor(components: (Component | [ settings: { width?: number, height?: number; }, element: Component ])[]) {
        super();
        this.wrapper.classList.add("wggrid");
        this.wrapper.style.display = "grid";
        components.map(x => {
            if (Array.isArray(x)) {
                const { width, height } = x[ 0 ];
                const ele = x[ 1 ].draw();
                if (width) ele.style.gridColumn = `${width} span`;
                if (height) ele.style.gridRow = `${height} span`;
                return ele;
            }
            return x.draw();
        }).forEach(item => this.wrapper.append(item));
    }
    setGap(gap = "var(--gap)") {
        this.wrapper.style.gap = gap;
        return this;
    }
    setRawColumns(template: string) {
        this.wrapper.style.gridTemplateColumns = template;
        return this;
    }
    setDynamicColumns(minSize = 6, max = "1fr") {
        this.wrapper.style.gridTemplateColumns = `repeat(auto-fit,minmax(${minSize}rem,${max}))`;
        return this;
    }
    setEvenColumns(count: number, size = "1fr") {
        this.wrapper.style.gridTemplateColumns = (`${size} `).repeat(count);
        return this;
    }

    setAutoRow(row: string) {
        this.wrapper.style.gridAutoRows = row;
        return this;
    }

    setAutoColumn(column: string) {
        this.wrapper.style.gridAutoColumns = column;
        return this;
    }

    setDirection(type: "column" | "row" | "row-reverse" | "column-reverse") {
        this.wrapper.style.gridAutoFlow = type;
        return this;
    }
}

export const Grid = (...components: (Component | [ settings: { width?: number, height?: number; }, element: Component ])[]) => new GridComponent(components);
