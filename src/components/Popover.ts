import { Component } from "../Component.ts";

export const Popover = (content: Component) => new class extends Component {
    constructor() {
        super();
        this.addClass("wpopover");
        this.wrapper.append(content.draw());
        this.setAttribute("popover");
    }

    protected showPopover() {
        this.wrapper.showPopover();
        return this;
    };

    protected hidePopover() {
        this.wrapper.hidePopover();
        return this;
    };

    protected togglePopover(force: boolean) {
        this.wrapper.togglePopover(force);
        return this;
    };

    protected pullingAnchorPositioning(anchorName: `--${string}`, positioning: (rect: DOMRect, style: CSSStyleDeclaration) => void, interval = 20) {
        setInterval(() => {
            const anchor = document.querySelector(`[anchor="${anchorName}"]`);
            if (!anchor) return;
            const rect = anchor.getBoundingClientRect();
            positioning(rect, this.wrapper.style);
        }, interval);
        return this;
    }
};