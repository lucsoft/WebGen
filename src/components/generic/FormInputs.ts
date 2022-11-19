import { accessibilityButton, accessibilityDisableTabOnDisabled } from "../../lib/Accessibility.ts";
import { Color } from "../../lib/Color.ts";
import { ButtonStyle, ColoredComponent, Component } from "../../types.ts";
import { createElement } from "../Components.ts";
import { changeClassAtIndex } from "../Helper.ts";
import { loadingWheel } from "../light-components/loadingWheel.ts";
import { Custom } from "./Custom.ts";
import { CommonIcon, CommonIconType, Icon } from "./Icon.ts";
import '../../css/input.webgen.static.css';
import { DataSource, DataSourceKey, ReactiveProxy } from "https://raw.githubusercontent.com/justin-schroeder/arrow-js/1599e06c3abb88c7bfbd7fffab264199d641e25b/src/index.ts";

export const speicalSyles = [ ButtonStyle.Spinner, ButtonStyle.Progress ];

export abstract class InputForm<Type> extends ColoredComponent {
    protected data: ReactiveProxy<DataSource> | null = null;

    protected key: DataSourceKey | null = null;

    setValue(value: Type) {
        this.dispatchEvent(new CustomEvent<Type>("update", { detail: value }));

        return this;
    }
    abstract saveData(data: Type): string | undefined;
    abstract parseData(data: FormDataEntryValue): Type;

    sync<Data extends DataSource>(data: ReactiveProxy<Data>, key: keyof Data) {
        this.data = data;
        this.key = key;
        if (Object.hasOwn(data, key))
            this.setValue(this.parseData(data[ key ]));
        data.$on(key, (value) => this.setValue(value));
        // @ts-ignore Problem is we want a clean key not a key wrapped in reactiveproxy
        this.addEventListener("update", (event) => data[ key ] = (<CustomEvent<Type>>event).detail);
        return this;
    }

    onChange(action: (data: Type) => void) {
        this.addEventListener("update", (data) => action((<CustomEvent<Type>>data).detail));
        return this;
    }
}
export class DropDownInputComponent<Value extends [ value: string, index: number ] | undefined> extends InputForm<Value> {
    prog = createElement("div");
    text = createElement("span");
    #dropdown: string[];
    constructor(dropdown: string[], label: string) {
        super();
        this.#dropdown = dropdown;
        this.wrapper.tabIndex = speicalSyles.includes(ButtonStyle.Normal) ? -1 : accessibilityDisableTabOnDisabled();
        this.wrapper.classList.add("wbutton", Color.Grayscaled, ButtonStyle.Normal);
        this.wrapper.append(loadingWheel());
        this.wrapper.onkeydown = accessibilityButton(this.wrapper);
        this.text.innerText = label;
        this.wrapper.append(this.text);
        this.addEventListener("update", (event) => {
            const data = (<CustomEvent<Value>>event).detail;
            this.text.innerText = data?.[ 0 ] ?? label;
        });
        this.wrapper.classList.add("isList");
        this.wrapper.addEventListener("click", () => {
            if (this.wrapper.classList.contains(Color.Disabled)) return;
            if (dropdown) this.wrapper.querySelector('ul')?.classList.toggle("open");
        });
        const list = createElement("ul");
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target as Node)) {
                list.classList.remove('open');
            }
        });
        dropdown.forEach((displayName, index) => {
            const entry = createElement("a");
            entry.tabIndex = 0;
            entry.onkeydown = accessibilityButton(entry);
            entry.innerText = displayName;
            entry.onclick = () => this.setValue([ displayName, index ] as Value);
            list.append(entry);
        });
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
    setColor(color: Color) {
        this.wrapper.tabIndex = accessibilityDisableTabOnDisabled(color);
        changeClassAtIndex(this.wrapper, color, 1);
        return this;
    }
    // deno-lint-ignore no-explicit-any
    parseData(data: any): Value {
        if (data == undefined) return <Value>undefined;
        return <Value>[ data.toString(), this.#dropdown.findIndex(([ value ]) => value == data) ];
    }
    saveData(data: Value) {
        return data?.[ 0 ];
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