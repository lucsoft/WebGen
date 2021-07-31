import { Component } from "./RenderingX";

export type ViewOptions<State> = (opt: { use: (comp: Component) => void, state: Partial<State>, update: (data: Partial<State>) => void }) => void;