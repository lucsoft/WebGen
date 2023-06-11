import { Pointable, Pointer, State } from "../../State.ts";
import { Color } from "../../lib/Color.ts";
import { Component, ButtonStyle } from "../../types.ts";
import { createElement } from "../Components.ts";
import { Button } from "./Button.ts";
import { IconButton } from "./IconButton.ts";
import './taglist.css';

export const Taglist = (list: Pointable<string>[], selected: Pointer<number>) => new class extends Component {
    items = createElement("div");
    move = createElement("div");

    constructor() {
        super();
        const state = State({
            left: false,
            right: false
        });
        this.wrapper.classList.add("wtags");
        this.items.classList.add("items");
        this.move.classList.add("move");

        // Construct layout
        this.wrapper.append(this.items, this.move);
        this.items.append(...list.map((x, i) =>
            Button(x)
                .setColor(Color.Colored)
                .onClick(() => selected.setValue(i))
                .setStyle(selected.map(index => index == i ? ButtonStyle.Normal : ButtonStyle.Secondary))
                .draw()
        ));

        this.move.append(
            IconButton("arrow_back_ios_new", "go backwards in tag list")
                .onClick(() => this.items.scrollBy({
                    left: 0 - this.wrapper.clientWidth / 2,
                    behavior: "smooth"
                }))
                .addClass(state.$left.map(val => val ? "show" : "hidden"))
                .draw(),
            IconButton("arrow_forward_ios", "go forward in tag list")
                .addClass(state.$right.map(val => val ? "show" : "hidden"))
                .onClick(() => this.items.scrollBy({
                    left: this.wrapper.clientWidth / 2,
                    behavior: "smooth"
                }))
                .draw(),
        );

        this.items.addEventListener("scroll", () => {
            if (this.items.scrollLeft == 0)
                state.left = false;
            else
                state.left = true;

            if (this.items.scrollWidth - this.items.clientWidth - this.items.scrollLeft == 0)
                state.right = false;
            else
                state.right = true;

        }, { passive: true });

        new ResizeObserver(() => {
            state.right = this.items.scrollWidth !== this.items.offsetWidth;
        }).observe(this.wrapper);
        // Because sometimes font rendering can get in out way
        setTimeout(() => {
            state.right = this.items.scrollWidth !== this.items.offsetWidth;
        }, 1000);
    }
};
