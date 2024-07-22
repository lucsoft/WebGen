import { Component } from "../Component.ts";
import { createElement } from "../Components.ts";
import { DataSourceKey, Reference, StateHandler } from "../State.ts";
import { ButtonStyle, ColoredComponent } from "../types.ts";
import { Custom } from "./Custom.ts";
import './FormInput.css';
type KeysMatching<T, V> = { [ K in keyof T ]-?: T[ K ] extends V ? K : never }[ keyof T ];

export const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];

export abstract class InputForm<StateValue> extends ColoredComponent {
    protected data: StateHandler<unknown> | null = null;

    protected key: DataSourceKey | null = null;
    protected valueRender = (data: StateValue) => `${data}` || JSON.stringify(data);

    protected setValue(value: StateValue) {
        this.dispatchEvent(new CustomEvent<StateValue>("update", { detail: value }));
        return this;
    }

    ref<T extends StateValue | undefined>(from: Reference<T>) {
        this.setValue(from.getValue() as StateValue);
        let first = true;
        from.listen((val) => {
            if (!first) {
                this.setValue(val as StateValue);
            }
            first = false;
        });
        this.addEventListener("update", (event) => from.setValue((<CustomEvent>event).detail));
        return this;
    }

    sync<Data extends StateHandler<unknown>, Key extends KeysMatching<Data, StateValue>>(data: Data, key: Key) {
        this.data = data;
        this.key = key;

        // Listen on Input Changes
        this.addEventListener("update", (event) => data[ key ] = (<CustomEvent<Data[ Key ]>>event).detail);

        // Read State value
        if (Object.hasOwn(data, key)) this.setValue(data[ key ] as StateValue);

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