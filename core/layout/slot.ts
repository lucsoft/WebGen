import type { Component } from "../components.ts";

export function Slot(name?: string): Component {
    const slot = document.createElement("slot");
    if (name) {
        slot.name = name;
    }
    return {
        draw() {
            return slot;
        }
    };
}