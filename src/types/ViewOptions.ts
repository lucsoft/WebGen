import { Component } from "./RenderingX";

export type ViewOptions<State> = {
    use: (comp: Component) => void;
    state: Partial<State>;
    update: (data: Partial<State>) => void;
};

export type ViewOptionsFunc<State> = (opt: ViewOptions<State>) => void;