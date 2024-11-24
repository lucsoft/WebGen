import { sortBy } from "jsr:@std/collections@^1.0.0";
import { asRefArray, Refable } from "../core/mod.ts";
import { AnyRoute } from "./Route.ts";

export type MenuEntry = {
    route: AnyRoute;
    label: Refable<string>;
    weight?: number;
};

export const MenuRegistry = asRefArray<MenuEntry>([]);

export const menuList = MenuRegistry.map(items => sortBy(items, item => item.weight ?? 0));