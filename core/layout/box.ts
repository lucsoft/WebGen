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

        for (const element of components.map(component => component.draw())) {
            element.slot = "static";
            this.append(element);
        }

        this.addListen(() => {
            const refComponent = alwaysRef(component);

            for (const component of this.children)
                if (component.slot === "dynamic")
                    component.remove();

            const current = refComponent.value;
            const alwaysList = Array.isArray(current) ? current : [ current ];

            for (const element of alwaysList.map(component => component.draw())) {
                element.slot = "dynamic";
                this.append(element);
            }
        });
    }
}

export function Box(component: Reference<Component[] | Component> | Component, ...components: Component[]) {
    return new BoxComponent(component, components).make();
}
