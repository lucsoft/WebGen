import { Component } from '../Component.ts';
import { Pointer } from '../State.ts';
import { Custom } from './Custom.ts';
import { Box } from './Stacks.ts';

declare global {
    interface Document {
        startViewTransition(callback: () => void): void;
    }

    interface CSSStyleDeclaration {
        viewTransitionName: string;
    }
}

// TODO turn this into a proper component, add it to webgen and opt-in to View Transitions API
export function List<T, Key extends string>(list: Pointer<T[]>, keyFunc: (data: T) => Key, renderFunc: (data: T) => Component): Component {
    const container: HTMLElement = Box().draw();

    list.listen((newValue: T[] = [], oldValue: T[] = []) => {
        const oldElements = oldValue.map(item => keyFunc(item));
        const newElements = newValue.map(item => keyFunc(item));

        newElements.filter(key => !oldElements.includes(key)).forEach(key => {
            const element = container.querySelector(`[data-key="${key}"]`);
            if (element) return;

            const component = renderFunc(newValue.find(item => keyFunc(item) === key)!)
                .setAttribute("data-key", key)
                .draw();

            component.style.viewTransitionName = `item-${key}`;
            container.append(component);
        });

        oldElements.filter(key => !newElements.includes(key)).forEach(key => {
            const element = container.querySelector(`[data-key="${key}"]`);
            element?.remove();
        });

        newElements.filter(key => oldElements.includes(key)).forEach(key => {
            const element = container.querySelector(`[data-key="${key}"]`);
            const index = newValue.findIndex(item => keyFunc(item) === key);
            if (element && element.parentElement?.children[ index ] !== element)
                element.parentElement?.insertBefore(element, element.parentElement.children[ index ]);
        });
    });


    return Custom(container).removeFromLayout();
}
