import '../../css/entry.webgen.static.css';
import { Pointable, Reactive, State } from "../../State.ts";
import { Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { Custom } from "./Custom.ts";
import { Icon } from "./Icon.ts";
import { Layer } from "./Layer.ts";
import { PlainText } from "./PlainText.ts";
import { Box, CenterV, Grid } from "./Stacks.ts";

type BasicLabel = {
    title: Pointable<string>;
    subtitle?: Pointable<string>;
};

export const Entry = (content: Component | BasicLabel) => new class extends Component {
    prefix = createElement("div");
    suffix = createElement("div");
    state = State({
        isLoading: false
    });

    constructor() {
        super();
        this.wrapper = Layer(content instanceof Component
            ? content
            : this.basicContent(content),
            2,
            "shadow"
        ).addClass("wentry").setBorderRadius("large").draw();

        this.prefix.classList.add("prefix");
        this.wrapper.prepend(this.prefix);
        this.suffix.classList.add("suffix");
        this.wrapper.append(this.suffix);
    }

    private basicContent(content: BasicLabel): Component {
        return Grid(...(content.subtitle
            ? [
                PlainText(content.title).addClass("title"),
                PlainText(content.subtitle).addClass("subtitle")
            ]
            : [
                PlainText(content.title).addClass("title")
            ])
        ).addClass("basic-text");
    }

    override addSuffix(component: Component): this {
        this.suffix.append(component.draw());
        return this;
    }

    override addPrefix(component: Component): this {
        this.prefix.append(component.draw());
        this.prefix.style.marginRight = "var(--gap)";
        return this;
    }
    onClick(func: (ev: MouseEvent) => void): this {
        this.onPromiseClick(async (e) => {
            await func(e);
        });
        return this;
    }

    onPromiseClick(func: (ev: MouseEvent) => Promise<void>): this {
        this.wrapper.classList.add("action");

        const item = CenterV(Icon("arrow_forward_ios")).draw();
        const actionIcon = Reactive(this.state, "isLoading", () =>
            this.state.isLoading ? Box(Custom(loadingWheel() as Element as HTMLElement)).addClass("loading")
                : Custom(item)
        ).addClass("action-item");
        this.suffix.append(actionIcon.draw());

        this.wrapper.onclick = (ev) => {
            this.state.isLoading = true;
            func(ev).then(() => { this.state.isLoading = false; });
        };
        return this;
    }
};