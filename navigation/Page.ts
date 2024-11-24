import { Component } from "../core/components.ts";
import { Box } from "../core/mod.ts";
import { asRefArray } from "../core/state.ts";
import { MenuEntry, MenuRegistry } from "./Menu.ts";

export const PageRegistry = asRefArray<{
    menuEntry: MenuEntry,
    page: Component;
}>([]);

export function createPage(menuEntry: MenuEntry, page: Component) {
    PageRegistry.addItem({
        menuEntry: menuEntry,
        page: page
    });
    MenuRegistry.addItem(menuEntry);
    const element = page.draw();
    return {
        route: menuEntry.route,
        page: {
            draw: () => element
        }
    };
}

export const PageRouter = Box(PageRegistry.map(pages =>
    pages.map(page => Box(page.menuEntry.route.active.map(active => active ? page.page : [])))
)).addClass("pages");