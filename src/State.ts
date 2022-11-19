import { ReactiveProxy, r, type DataSource } from "https://raw.githubusercontent.com/justin-schroeder/arrow-js/1599e06c3abb88c7bfbd7fffab264199d641e25b/src/index.ts";
import { Component } from "./webgen.ts";
export type StateData = DataSource;
export type StateHandler<data extends StateData> = ReactiveProxy<data>;
export const State: <T extends StateData>(data: T) => StateHandler<T> = r;


export class ReactiveComponent<Data extends StateData, Key extends keyof Data> extends Component {

    constructor(data: StateHandler<Data>, key: Key, draw: () => Component) {
        super();
        data.$on(key, () => {
            // @ts-ignore Ignore
            this.wrapper.children[ 0 ].replaceWith(draw(data[ key ]).draw());
        });
        // @ts-ignore Ignore
        this.wrapper.append(draw(data[ key ]).draw());
    }
}

export const Reactive = <Data extends StateData, Key extends keyof Data>(data: StateHandler<Data>, key: Key, draw: () => Component) => new ReactiveComponent(data, key, draw);