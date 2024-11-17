import { asRef, asWebGenComponent, Box, Color, Component, css, HTMLComponent, listen, Refable, Reference } from "../core/mod.ts";
import { alwaysRef } from "../core/state.ts";
import { InlineInput } from "./form/inlineInput.ts";
import { MaterialIcon } from "./icons.ts";
import { PrimaryButton, TextButton } from "./mod.ts";

@asWebGenComponent("menu")
class MenuComponent extends HTMLComponent {
    #valueRender = asRef((value: string) => value);
    #showSearch: Reference<boolean>;
    #searchLabel = asRef("Search");
    #searchValue = asRef("");
    #actions = asRef<{ title: Refable<string>, icon: Component, onClick: () => void; }[]>([]);
    #searchInput = InlineInput(this.#searchValue, this.#searchLabel);
    #onItemClicked = asRef((_item: string) => { });

    #searchEngine: (search: string) => Reference<string[]> = ((search) => {
        const items = this.items.value;
        const valueRender = this.#valueRender.value;
        return asRef(items.filter(item => valueRender(item).toLowerCase().includes(search.toLowerCase())));
    });

    constructor(private items: Reference<string[]>) {
        super();
        this.#showSearch = items.map(list => list.length > 15);

        const searchBox = Box(
            MaterialIcon("search").setTextSize("base"),
            this.#searchInput
        )
            .setRadius("tiny")
            .addStyle(css`
                :host {
                    display: grid;
                    grid-template-columns: max-content auto;
                    background: ${Color.reverseNeutral.mix(Color.primary, `5%`)};
                    height: 28px;
                    align-items: center;
                    font-size: 13.8px;
                    padding: 0 8px;
                    gap: 5px;
                }
            `);

        const activeItems = asRef<string[]>([]);

        this.addWatch(() => listen(() => {
            activeItems.value = this.#searchEngine(this.#searchValue.value).value;
        }));

        this.shadowRoot!.append(
            Box(
                activeItems.map(items => items.map((item) => Box(
                    TextButton(this.#valueRender.value(item))
                        .addStyle(css`
                            button {
                                justify-content: start;
                            }
                        `)
                        .addClass("item")
                        .onClick(() => {
                            this.#onItemClicked.value(item);
                        })
                )))
            )
                .addPrefix(Box(
                    this.#showSearch.map(showSearch => showSearch ? searchBox : [])
                ))
                .addSuffix(Box(
                    this.#actions.map(actions => actions.map(action =>
                        PrimaryButton(action.title)
                            .addPrefix(action.icon)
                            .onClick(action.onClick)
                            .addStyle(css`
                                button {
                                    justify-content: start;
                                    --wg-button-font-size: 13.8px;
                                    --wg-button-height: 28px;
                                    --wg-button-text-padding: 0 2px;
                                    padding: 0 8px;
                                    --wg-button-background-color: ${Color.reverseNeutral.mix(Color.primary, `5%`)};
                                    --wg-button-text-color: var(--wg-neutral);
                                }
                                button>wg-icon {
                                    font-size: 19px;
                                }
                            `)
                    ))
                ))
                .addClass("list")
                .setRadius("mid")
                .draw()
        );


        this.shadowRoot!.adoptedStyleSheets.push(css`
            .list {
                max-height: 100%;
                display: grid;
                gap: 5px;
                background-color: ${Color.reverseNeutral.mix(Color.primary, `25%`)};
                padding: 5px;
                --wg-button-padding: 0 5px;
                overflow: auto;
                box-shadow: var(--wg-shadow-4);
            }
        `);
    }

    override make() {
        const obj = {
            ...super.make(),
            setValueRenderer: (renderer: Refable<(value: string) => string>) => {
                this.useListener(alwaysRef(renderer), value => {
                    this.#valueRender.value = value;
                });
                return obj;
            },
            setSearchEngine: (searchEngine: (search: string) => Reference<string[]>) => {
                this.#searchEngine = searchEngine;
                return obj;
            },
            focusedState: () => {
                return this.#searchInput.focusedState();
            },
            onItemClick: (callback: (item: string) => void) => {
                this.#onItemClicked.value = callback;
                return obj;
            },
            clearSearch: () => {
                this.#searchValue.value = "";
                return obj;
            },
            addAction: (title: Refable<string>, icon: Component, onClick: () => void) => {
                this.#actions.value.push({ title, icon, onClick });
                return obj;
            }
        };
        return obj;
    }
}


export function Menu(items: Refable<string[]>) {
    return new MenuComponent(alwaysRef(items)).make();
}