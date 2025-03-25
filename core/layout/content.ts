import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { alwaysRef, Reference } from "../state.ts";

@asWebGenComponent("full-width-section")
class FullWidthSectionComponent extends HTMLComponent {
    constructor(
        components: Component[]
    ) {
        super();

        this.style.display = "grid";
        this.style.gridTemplateColumns = "inherit";
        this.style.gridColumn = "full-width";

        for (const iterator of components) {
            const item = iterator.draw();
            item.style.gridColumn = "full-width";
            this.append(item);
        }
    }
}
export const FullWidthSection = (...elements: Component[]) => new FullWidthSectionComponent(elements).make();

@asWebGenComponent("content")
export class ContentComponent extends HTMLComponent {
    constructor(component: Reference<Component[] | Component> | Component, components: Component[]) {
        super();
        this.style.display = "grid";

        this.style.setProperty("--content-padding", "16px");
        this.style.gridTemplateColumns = [
            "[full-width-start]",
            "minmax(var(--content-padding), 1fr)",
            "[content-start]",
            "min(100% - (var(--content-padding) * 2), var(--content-max-width, 900px))",
            "[content-end]",
            "minmax(var(--content-padding), 1fr)",
            "[full-width-end]",
        ].join(" ");
        this.style.alignContent = "start";

        const dynamicElement = document.createElement("slot");
        dynamicElement.name = "dynamic";
        const staticElements = document.createElement("slot");
        staticElements.name = "static";
        this.shadowRoot!.append(dynamicElement, staticElements);

        this.addListen(() => {
            const current = alwaysRef(component).value;
            const alwaysList = Array.isArray(current) ? current : [ current ];

            this.replaceChildren(
                ...alwaysList
                    .map(component => component.draw())
                    .map(element => {
                        if (element instanceof FullWidthSectionComponent) {
                            return Array.from(element.children)
                        } else {
                            element.style.gridColumn = "content";
                            return [element];
                        }
                    }).flat().map(element => {
                        element.slot = "dynamic";
                        return element;
                    }),
                ...components
                    .map(component => component.draw())
                    .map(element => {
                        if (element instanceof FullWidthSectionComponent) {
                            return Array.from(element.children)
                        } else {
                            element.style.gridColumn = "content";
                            return [element];
                        }
                    }).flat().map(element => {
                        element.slot = "static";
                        return element;
                    })
            );
        });
    }

    override make() {
        const obj = {
            ...super.make(),
            setContentMaxWidth: (size: string) => {
                this.style.setProperty("--content-max-width", size);
                return obj;
            },
            setContentPadding: (size: string) => {
                this.style.setProperty("--content-padding", size);
                return obj;
            },
            fillHeight: () => {
                this.style.marginBlockEnd = "auto";
                return obj;
            }
        };
        return obj;
    }
}

export const Content = (component: Reference<Component[] | Component> | Component, ...components: Component[]) => new ContentComponent(component, components).make();
