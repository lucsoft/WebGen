import { Component } from "../Component.ts";
import "./Popover.css";

export const Popover = (content: Component) => new class extends Component {
    constructor() {
        super();
        this.addClass("wpopover");
        this.wrapper.append(content.draw());
        this.setAttribute("popover");
        document.body.append(this.draw());
    }

    public showPopover() {
        try {
            this.wrapper.showPopover();
        } catch {
            //
        }
        return this;
    };

    public hidePopover() {
        try {
            this.wrapper.hidePopover();
        } catch {
            console.log("Failed to hide popover");
            //
        }
        return this;
    };

    public togglePopover(force: boolean) {
        this.wrapper.togglePopover(force);
        return this;
    };

    public isOpen() {
        return this.wrapper.matches(':popover-open');
    }

    public clearAnchors(anchorName: `--${string}`) {
        const anchors = document.querySelectorAll(`[anchor="${anchorName}"]`);
        anchors.forEach(anchor => anchor.removeAttribute("anchor"));
        return this;
    }
    public pullingAnchorPositioning(anchorName: `--${string}`, positioning: (rect: DOMRect, style: CSSStyleDeclaration) => void, interval = 20) {
        setInterval(() => {
            const anchor = document.querySelector(`[anchor="${anchorName}"]`);
            if (!anchor) return;
            const rect = anchor.getBoundingClientRect();
            positioning(rect, this.wrapper.style);
        }, interval);
        return this;
    }
};