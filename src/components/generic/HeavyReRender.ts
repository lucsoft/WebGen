import { Component } from "../../types.ts";
import { Pointable, asPointer } from "../../webgen.ts";

class HeavyReRenderImpl<T> extends Component {

    constructor(item: Pointable<T>, map: (val: T) => Component) {
        super();
        console.debug("HeavyReRender got constructed");
        const it = asPointer(item);
        it.listen((val: T) => {
            this.wrapper.textContent = '';
            this.wrapper.append(map(val).draw());
        });
    }
}
export const HeavyReRender = <T>(item: Pointable<T>, map: (val: T) => Component) => new HeavyReRenderImpl(item, map);