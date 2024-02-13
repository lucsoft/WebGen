import { Color } from "../Color.ts";
import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { DataSourceKey, Refable, StateHandler, asRef, isRef } from "../State.ts";
import { MIcon } from "../icons/MaterialIcons.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import { Box } from "./Box.ts";
import { Button, ButtonComponent } from "./Button.ts";
import { Custom } from "./Custom.ts";
import './DropDown.css';
import './FormInput.css';
import { Layer } from "./Layer.ts";
import { Items } from "./List.ts";
import { Popover } from "./Popover.ts";
import { Grid } from "./Stacks.ts";
type KeysMatching<T, V> = { [ K in keyof T ]-?: T[ K ] extends V ? K : never }[ keyof T ];

export const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];

export abstract class InputForm<StateValue> extends ColoredComponent {
    protected data: StateHandler<unknown> | null = null;

    protected key: DataSourceKey | null = null;
    protected valueRender = (data: StateValue) => `${data}` || JSON.stringify(data);

    setValue(value: Refable<StateValue> | undefined) {
        if (isRef(value))
            value.listen((val) => this.dispatchEvent(new CustomEvent<StateValue>("update", { detail: val })));
        else
            this.dispatchEvent(new CustomEvent<StateValue>("update", { detail: asRef(value).getValue() }));

        return this;
    }

    sync<Data extends StateHandler<unknown>, Key extends KeysMatching<Data, StateValue>>(data: Data, key: Key) {
        this.data = data;
        this.key = key;

        // Listen on Input Changes
        this.addEventListener("update", (event) => data[ key ] = (<CustomEvent<Data[ Key ]>>event).detail);

        // Read State value
        if (Object.hasOwn(data, key)) this.setValue(data[ key ] as Refable<StateValue>);

        // Wait for State changes
        data.$on(key, (value) => this.setValue(value));
        return this;
    }
    setRender(action: (data: StateValue) => string) {
        this.valueRender = action;
        this.dispatchEvent(new CustomEvent<StateValue>("data", {}));
        return this;
    }
    onChange(action: (data: StateValue) => void) {
        this.addEventListener("update", (data) => action((<CustomEvent<StateValue>>data).detail));
        return this;
    }
}

const content = asRef(Box());
const dropDownPopover = Popover(Layer(
    content.asRefComponent(),
    5
).setBorderRadius("mid").addClass("wdropdown-outer-layer"))
    .pullingAnchorPositioning("--wdropdown-default", (rect, style) => {
        style.top = `max(-5px, ${rect.bottom}px)`;
        style.left = `${rect.left}px`;
        style.minWidth = `${rect.width}px`;
        style.bottom = "var(--gap)";
    });

export class DropDownInputComponent<Value extends string> extends InputForm<Value> {
    prog = createElement("div");
    text = createElement("span");
    button: ButtonComponent;
    constructor(dropdown: Refable<string[]>, label: Refable<string | Component>, icon = MIcon("keyboard_arrow_down")) {
        super();

        const text = asRef(label);
        this.button = Button(text).addSuffix(icon);

        this.wrapper.innerHTML = "";
        this.color.setValue(Color.Disabled);
        this.wrapper.append(this.button.draw());
        this.wrapper.classList.add("wdropdown");

        this.addEventListener("update", (event) => {
            const data = (<CustomEvent<Value>>event).detail;
            text.setValue(data == undefined ? asRef(label).getValue() : this.valueRender(data));
            dropDownPopover.hidePopover();
        });

        this.button.onClick(() => {
            this.wrapper.append(dropDownPopover.draw());
            dropDownPopover.showPopover();
            this.button.setAnchorName("--wdropdown-default");
            content.setValue(Grid(
                Items(asRef(dropdown), item =>
                    Button(item)
                        .setStyle(ButtonStyle.Inline)
                        .onClick(() => {
                            this.setValue(item as Value);
                        })
                )
            )
                .addClass("wdropdown-content")
                .setDirection("row")
                .setGap("5px")
                .setPadding("5px")
            );
        });
    }
    setStyle(style: ButtonStyle, progress?: number) {
        this.button.setStyle(style, progress);
        return this;
    }
}

export const DropDownInput = (label: string, list: string[]) => new DropDownInputComponent(list, label);

export function DropAreaInput(draw: Component, formats: string[], onData?: (data: { blob: Blob, file: File, url: string; }[]) => void) {
    const shell = createElement("div");
    shell.ondragleave = (ev) => {
        ev.preventDefault();
        shell.classList.remove("hover");
    };
    shell.ondragover = (ev) => {
        ev.preventDefault();
        shell.classList.add("hover");
    };
    shell.ondrop = async (ev) => {
        ev.preventDefault();
        shell.classList.remove("hover");
        onData?.(await Promise.all(Array.from(ev.dataTransfer?.files ?? []).filter(x => formats.includes(x.type)).map(async x => {
            const blob = new Blob([ await x.arrayBuffer() ], { type: x.type });
            return { file: x, blob, url: URL.createObjectURL(blob) };
        })));
    };
    shell.classList.add("drop-area");
    shell.append(draw.draw());
    return Custom(shell);
}

export function UploadFilesDialog(onData: (files: { blob: Blob, file: File, url: string; }[]) => void, accept: string) {
    const upload = createElement("input");
    upload.type = "file";
    upload.accept = accept;
    upload.click();
    upload.onchange = async () => {
        const list = await Promise.all(Array.from(upload.files ?? []).map(async file => {
            const blob = new Blob([ await file.arrayBuffer() ], { type: file.type });
            return { blob, file, url: URL.createObjectURL(blob) };
        }));
        onData(list);
    };
}