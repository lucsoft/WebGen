import { asWebGenComponent, Component, HTMLComponent } from "../components.ts";
import { alwaysRef, Reference } from "../state.ts";

@asWebGenComponent("box")
export class BoxComponent extends HTMLComponent {
    constructor(component: Reference<Component[] | Component> | Component, components: Component[]) {
        super();
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
                        element.slot = "dynamic";
                        return element;
                    }),
                ...components
                    .map(component => component.draw())
                    .map(element => {
                        element.slot = "static";
                        return element;
                    })
            );
        });
    }
}

export function Box(component: Reference<Component[] | Component> | Component, ...components: Component[]) {
    return new BoxComponent(component, components).make();
}
