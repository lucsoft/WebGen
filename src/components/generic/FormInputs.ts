import '../../css/input.webgen.static.css';
import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { Color } from "../../lib/Color.ts";
import { DataSourceKey, isPointer, Pointable, StateHandler } from "../../State.ts";
import { ButtonStyle, ColoredComponent, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { changeClassAtIndex } from "../Helper.ts";
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { Custom } from "./Custom.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";

type KeysMatching<T, V> = { [ K in keyof T ]-?: T[ K ] extends V ? K : never }[ keyof T ];

export const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];

export abstract class InputForm<StateValue> extends ColoredComponent {
    protected data: StateHandler<unknown> | null = null;

    protected key: DataSourceKey | null = null;
    protected valueRender = (data: StateValue) => `${data}` || JSON.stringify(data);

    setValue(value: Pointable<StateValue> | undefined) {
        if (isPointer(value))
            value.listen((val) => this.dispatchEvent(new CustomEvent<StateValue>("update", { detail: val })));
        else
            this.dispatchEvent(new CustomEvent<StateValue>("update", { detail: value }));

        return this;
    }

    sync<Data extends StateHandler<unknown>, Key extends KeysMatching<Data, StateValue>>(data: Data, key: Key) {
        this.data = data;
        this.key = key;

        // Listen on Input Changes
        this.addEventListener("update", (event) => data[ key ] = (<CustomEvent<Data[ Key ]>>event).detail);

        // Read State value
        if (Object.hasOwn(data, key)) this.setValue(data[ key ] as Pointable<StateValue>);

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
export class DropDownInputComponent<Value extends string> extends InputForm<Value> {
    prog = createElement("div");
    text = createElement("span");
    constructor(dropdown: string[], label: string) {
        super();
        this.wrapper.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        this.wrapper.classList.add("wbutton", ButtonStyle.Normal);
        this.wrapper.append(loadingWheel());
        this.wrapper.onkeydown = accessibilityButton(this.wrapper);
        this.text.innerText = label;
        this.wrapper.append(this.text);
        this.addEventListener("update", (event) => {
            const data = (<CustomEvent<Value>>event).detail;
            this.text.innerText = data == undefined ? label : this.valueRender(data);
        });
        this.wrapper.classList.add("isList", "wdropdown");
        this.wrapper.addEventListener("click", () => {
            if (this.color.getValue() == Color.Disabled) return;
            if (dropdown) this.wrapper.querySelector('ul')?.classList.toggle("open");
        });
        const list = createElement("ul");
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target as Node)) {
                list.classList.remove('open');
            }
        });
        this.addEventListener("data", () => {
            list.innerHTML = "";
            dropdown.forEach((displayName) => {
                const entry = createElement("a");
                entry.tabIndex = 0;
                entry.onkeydown = accessibilityButton(entry);
                entry.innerText = this.valueRender(displayName as Value);
                entry.onclick = () => this.setValue(displayName as Value);
                list.append(entry);
            });
        });
        this.dispatchEvent(new CustomEvent("data", {}));
        const iconContainer = createElement("div");
        iconContainer.classList.add("icon-suffix");
        iconContainer.append(Icon(CommonIcon(CommonIconType.ArrowDown)).draw());
        this.wrapper.append(list, iconContainer);
    }
    setStyle(style: ButtonStyle, progress?: number) {
        this.wrapper.tabIndex = speicalSyles.includes(style) ? -1 : accessibilityDisableTabOnDisabled();
        changeClassAtIndex(this.wrapper, style, 2);
        if (style === ButtonStyle.Spinner) {
            this.wrapper.classList.add("loading");
        }
        if (progress !== undefined && style === ButtonStyle.Progress) {
            this.prog.classList.add("progress");
            this.prog.style.width = `${progress.toString()}%`;
            this.wrapper.append(this.prog);
        }
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