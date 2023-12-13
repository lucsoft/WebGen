import { Component } from "../Component.ts";
import './Content.css';

class SectionComponent extends Component {
    constructor(
        public readonly sectionId: string,
        readonly elements: Component[]
    ) {
        super();
        if (sectionId === "content")
            throw new Error("sectionId cannot be default");

        for (const iterator of elements) {
            const item = iterator.draw();
            item.style.gridColumn = sectionId;
            this.wrapper.append(item);
        }
    }
}

export const FullWidthSection = (...elements: Component[]) => new SectionComponent("full-width", elements).addClass("full-width-section");

export class ContentComponent extends Component {
    constructor(...elements: Component[]) {
        super();
        this.addClass("wcontent");
        for (const element of elements) {
            if (element instanceof SectionComponent) {
                this.wrapper.append(...Array.from(element.draw().children));
            } else {
                const item = element.draw();
                item.style.gridColumn = "content";
                this.wrapper.append(item);
            }
        }

        this.wrapper.style.setProperty("--content-padding", "16px");
        this.wrapper.style.setProperty("--content-max-width", "900px");

        this.wrapper.style.gridTemplateColumns = [
            "[full-width-start]",
            "minmax(var(--content-padding), 1fr)",
            // TODO: Allow more sections to be added,
            "[content-start]",
            "min(100% - (var(--content-padding) * 2), var(--content-max-width))",
            "[content-end]",
            // TODO: Allow more sections to be added,
            "minmax(var(--content-padding), 1fr)",
            "[full-width-end]",
        ].join(" ");
    }

    setMaxWidth(size: string) {
        this.wrapper.style.setProperty("--content-max-width", size);
        return this;
    }

    setPadding(size: string) {
        this.wrapper.style.setProperty("--content-padding", size);
        return this;
    }
}

export const Content = (...elements: Component[]) => new ContentComponent(...elements);