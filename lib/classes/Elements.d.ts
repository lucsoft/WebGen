import { ElementModifyer } from "./ElementModify";
import { WebGenElements } from "./WebGenElements";
export declare class Elements {
    layout(id: string, remove?: true | false): {
        element: ElementModifyer;
    } | undefined;
    clear(addto?: {
        type: "id" | "firstTag";
        name: string;
    }): void;
    add(addto?: {
        type: "id" | "firstTag";
        name: string;
    }): WebGenElements;
}
