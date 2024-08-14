import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { MIcon } from "../icons/MaterialIcons.ts";
import { asRef, Refable, Reference, refMerge } from "../State.ts";
import { ButtonStyle } from "../types.ts";
import { Box } from "./Box.ts";
import { Button, ButtonComponent } from "./Button.ts";
import './DropDown.css';
import { InputForm } from "./FormInputs.ts";
import { InlineTextInput } from "./FormText.ts";
import { Layer } from "./Layer.ts";
import { Items } from "./List.ts";
import { Popover } from "./Popover.ts";
import { Grid } from "./Stacks.ts";

const content = asRef(Box());
const dropDownPopover = Popover(Layer(
    content.asRefComponent(),
    5
)
    .setBorderRadius("mid")
    .addClass("shadow-4")
    .addClass("wdropdown-outer-layer"))
    .addClass("wdropdown-popover")
    .pullingAnchorPositioning("--wdropdown-default", (rect, style) => {
        style.top = `max(15px, ${rect.bottom.toFixed(2)}px)`;
        style.left = `${rect.left}px`;
        style.minWidth = `${rect.width}px`;
        style.bottom = "var(--gap)";
    });


export class DropDownInputComponent<Value extends string> extends InputForm<Value> {
    prog = createElement("div");
    text = createElement("span");
    button: ButtonComponent;
    #actions = asRef<{ title: Refable<string>, icon: Component, onClick: (env: MouseEvent, e: ButtonComponent) => void; }[]>([]);
    #searchLabel = asRef("Search");
    #searchString = asRef("");
    #searchEngine = asRef<(search: Reference<string>) => Refable<string[]>>((search) => {
        // we just implement a client side search here.
        return refMerge({ source: asRef(this.dropdown), search })
            .map(({ search, source }) => source.filter(item => this.valueRender(item as Value).toLowerCase().includes(search.toLowerCase())));
    });
    static showSearchAtCount = 15;

    constructor(private dropdown: Refable<string[]>, label: Refable<string | Component>, icon = MIcon("keyboard_arrow_down")) {
        super();

        const text = asRef(label);
        this.button = Button(text)
            .setWidth("100%")
            .setJustifyContent("space-between")
            .setColor(this.color)
            .addSuffix(icon);

        this.wrapper.append(this.button.draw());
        this.wrapper.classList.add("wdropdown");

        this.addEventListener("update", (event) => {
            const data = (<CustomEvent<Value>>event).detail;
            text.setValue(data == undefined ? asRef(label).getValue() : this.valueRender(data));
            dropDownPopover.hidePopover();
        });

        const searchBox = InlineTextInput("text", "live")
            .addPrefix(MIcon("search"))
            .ref(this.#searchString)
            .setPlaceholder(this.#searchLabel)
            .addClass("wdropdown-action", "wdropdown-search")
            .onKeyPressed((event) => {
                if (event.key === "Enter") {
                    this.setValue(asRef(this.#searchEngine.getValue()(this.#searchString)).getValue()[ 0 ] as Value);
                }
            });

        this.button.onClick(() => {
            if (dropDownPopover.isOpen()) {
                dropDownPopover.hidePopover();
                return;
            }
            this.#searchString.setValue("");
            dropDownPopover.clearAnchors("--wdropdown-default");
            this.button.setAnchorName("--wdropdown-default");
            dropDownPopover.showPopover();
            const dropdownList = asRef(dropdown);
            const isSearchAvailable = dropdownList.map(items => items.length > DropDownInputComponent.showSearchAtCount);
            content.setValue(Grid(
                isSearchAvailable.map(search => search ? searchBox : Box().removeFromLayout()).asRefComponent(),
                this.#searchEngine.map(searchEngine =>
                    Items(
                        asRef(searchEngine(this.#searchString)),
                        item => Button(this.valueRender(item as Value))
                            .setStyle(ButtonStyle.Inline)
                            .onClick(() => {
                                this.setValue(item as Value);
                            })
                    )
                ).asRefComponent(),
                Items(this.#actions, item =>
                    Button(item.title)
                        .addPrefix(item.icon)
                        .addClass("wdropdown-action")
                        .setStyle(ButtonStyle.Inline)
                        .onClick((env, e) => {
                            dropDownPopover.hidePopover();
                            item.onClick(env, e);
                        })
                )
            )
                .addClass("wdropdown-content")
                .setDirection("row")
                .setGap("5px")
                .setPadding("5px")
            );

            requestAnimationFrame(() => {
                if (isSearchAvailable.getValue()) {
                    searchBox.focus();
                }
            });
        });
    }

    setSearchLabel(label: Refable<string>) {
        asRef(label).listen(val => this.#searchLabel.setValue(val));
        return this;
    }

    /**
     * Define a search engine for the dropdown. If connected to a server, add debounce and caching. an empty string should be instant, same as asking the engine the same search string (used for opening the first entry)
     */
    setSearchEngine(createSearchEngine: (search: Reference<string>) => Refable<string[]>) {
        this.#searchEngine.setValue((text) => createSearchEngine(text));
        return this;
    }

    addAction(icon: Component, title: Refable<string>, onClick: (env: MouseEvent, e: ButtonComponent) => void) {
        this.#actions.addItem({ icon, title, onClick });
        return this;
    }
}

export const DropDownInput = (label: string, list: Refable<string[]>) => new DropDownInputComponent(list, label);
