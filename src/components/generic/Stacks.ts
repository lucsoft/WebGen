import { Component } from "../../types.ts";
import '../../css/stack.webgen.static.css';
import { dropNullish } from "../Helper.ts";

class SpacerCompoent extends Component { }
class AlignComponent extends Component {
    constructor(type: 'horizontal-stack' | 'vertical-stack', components: (Component | null)[]) {
        super()
        this.wrapper.classList.add(type);
        this.wrapper.append(...dropNullish(...components).map(x => x.draw()))
    }
    setMargin(margin?: string): AlignComponent {
        this.wrapper.style.width = margin ? `calc(100% - ${margin} - ${margin})` : "";
        this.wrapper.style.margin = margin ?? "";
        return this;
    }
    setGap(gap: string): AlignComponent {
        this.wrapper.style.gap = gap;
        return this;
    }
}
export const Spacer = () => new SpacerCompoent().addClass('spacer');
export const Horizontal = (...components: (Component | null)[]) => new AlignComponent("horizontal-stack", components);
export const Vertical = (...components: (Component | null)[]) => new AlignComponent("vertical-stack", components);
/*
export interface GridComponent extends BaseComponent<GridComponent, HTMLDivElement> {
    setMaxWidth: (maxWidth: string) => GridComponent
    setMinColumnWidth: (width: string) => GridComponent
    setGap: (gap: string) => GridComponent
}
export const Grid = (...cardArray: CommonCard[]) => {
    const element = createElement("grid" as "div");
    element.append(...cardArray.map(x => {
        const card = x.make();
        const { height, width } = x.getSize();
        if (height && height > 0) card.style.gridRow = `span ${height}`;
        if (width && width > 0) card.style.gridColumn = `span calc(${width})`;
        return card
    }))
    const settings: GridComponent = {
        draw: () => element,
        addClass: (...classes: string[]) => {
            element.classList.add(...classes);
            return settings;
        },
        setMaxWidth: (maxWidth: string) => {
            element.style.setProperty('--max-width', maxWidth)
            return settings;
        },
        setMinColumnWidth: (width: string) => {
            element.style.setProperty('--card-min-width', width)
            return settings;
        },
        setGap: (gap: string) => {
            element.style.setProperty('--gap', gap)
            return settings;
        }
    };
    return settings;
}*/