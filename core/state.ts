import { Signal } from "https://esm.sh/signal-polyfill@0.2.2";

export function isRef<T>(obj: unknown): obj is Reference<T> {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'listen' in obj
    );
}

export interface RefEvent<Type> {
    (value: Type, oldValue?: Type): void;
}

export interface Reference<T> {
    getValue(): T;
    value: T;
    listen(c: RefEvent<T>): { unlisten: () => void; };
    map<NewType>(mapper: (val: T) => NewType): Reference<NewType>;
}

export class WriteSignal<T> extends Signal.State<T> implements Reference<T> {
    getValue(): T {
        return this.get();
    }
    setValue(val: T): void {
        this.set(val);
    }
    get value(): T {
        return this.get();
    }
    set value(val: T) {
        this.set(val);
    }
    listen(c: RefEvent<T>): { unlisten: () => void; } {
        let oldValue = undefined as T;
        return listen(() => {
            if (oldValue === this.get()) return;
            c(this.get(), oldValue);
            oldValue = this.get();
        });
    }
    map<NewType>(mapper: (val: T) => NewType): Reference<NewType> {
        return new ReadSignal<NewType>(() => {
            return mapper(this.get());
        });
    }
}

export class ArrayWriteSignal<T extends D[], D> extends WriteSignal<T> {

    constructor(initValue: T, options?: Signal.Options<T>) {
        super(initValue, options);
    }

    get value(): Readonly<T> {
        return super.get();
    }

    set value(value: T) {
        super.setValue(value);
    }

    getValue(): Readonly<T> {
        return super.getValue();
    }
    get(): Readonly<T> {
        return super.get();
    }
    addItem(item: D) {
        this.value = [ ...this.value, item ] as T;
    }
    removeItem(item: D) {
        this.value = this.value.filter(it => it !== item) as T;
    }
}

export class ReadSignal<T> extends Signal.Computed<T> implements Reference<T> {
    getValue(): T {
        return this.get();
    }
    get value(): T {
        return this.get();
    }
    listen(c: RefEvent<T>): { unlisten: () => void; } {
        let oldValue = undefined as T;
        return listen(() => {
            if (oldValue === this.get()) return;
            c(this.get(), oldValue);
            oldValue = this.get();
        });
    }
    map<NewType>(mapper: (val: T) => NewType): Reference<NewType> {
        return new ReadSignal<NewType>(() => {
            return mapper(this.get());
        });
    }
}


export let WEBGEN_LISTEN_COUNT = 0;
let pending = false;

const watcher = new Signal.subtle.Watcher(() => {
    if (!pending) {
        pending = true;
        let countOfRepeats = 0;

        const triggerUpdate = () => {
            queueMicrotask(() => {
                for (const s of watcher.getPending()) s.get();
                watcher.watch();
                if (countOfRepeats > 1000) {
                    console.error("Infinite Loop Detected");
                    return;
                }
                if (watcher.getPending().length > 0) {
                    countOfRepeats++;
                    triggerUpdate();
                } else {
                    pending = false;
                    if (countOfRepeats > 10) {
                        console.warn("Large Waterfall of Updates Detected! Count:", countOfRepeats);
                        return;
                    }
                }
            });
        };
        triggerUpdate();
    }
});

export function listen(callback: () => void): { unlisten: () => void; } {
    WEBGEN_LISTEN_COUNT++;
    if (WEBGEN_LISTEN_COUNT % 1000 === 0) {
        console.debug("Leaking Listener? Found:", WEBGEN_LISTEN_COUNT);
    }
    const computed = new Signal.Computed(() => { callback(); });
    watcher.watch(computed);
    computed.get();
    return {
        unlisten: () => {
            WEBGEN_LISTEN_COUNT--;
            watcher.unwatch(computed);
        }
    };
}

export function asRef<T>(initValue: T, options?: Signal.Options<T>): WriteSignal<T> {
    return new WriteSignal(initValue, options);
}

export function asRefArray<T>(initValue: T[], options?: Signal.Options<T[]>): ArrayWriteSignal<T[], T> {
    return new ArrayWriteSignal(initValue, options);
}

export type RefRecord<T> = { [ Key in keyof T ]: WriteSignal<T[ Key ]> }

// deno-lint-ignore no-explicit-any
export function asRefRecord<T extends object>(initValue: T, options?: Signal.Options<any>): RefRecord<T> {
    const keys = Object.keys(initValue) as (keyof T)[];
    const result = {} as { [ Key in keyof T ]: WriteSignal<T[ Key ]> };
    for (const key of keys) {
        result[ key ] = asRef(initValue[ key ], options);
    }
    return result;
}

export function asDeepRef<T extends object>(initValue: T, options?: Signal.Options<T>): DeepWriteSignal<T> {
    return new DeepWriteSignal(initValue, options);
}

export function alwaysRef<T>(value: Refable<T>): Reference<T> {
    if (isRef(value))
        return value;
    return new ReadSignal(() => value);
}

export function fromRefs<T>(callback: () => T): Reference<T> {
    return new ReadSignal(callback);
}

function nestedProxy<T extends object>(object: T, callback: () => void) {
    const handler: ProxyHandler<T> = {
        get(target, key) {
            if (key == 'isProxy')
                return true;

            const prop = target[ key as keyof T ];

            // return if property not found
            if (typeof prop == 'undefined')
                return;

            // set value as proxy if object
            if (!prop![ 'isProxy' as keyof typeof prop ] && typeof prop === 'object')
                // @ts-ignore : works
                target[ key as keyof T ] = new Proxy(prop as object, handler);

            return target[ key as keyof T ];
        },
        set(target, key, value) {
            callback();
            target[ key as keyof T ] = value;
            return true;
        }
    };

    const proxy = new Proxy(object, handler);

    return proxy;
}

export class DeepWriteSignal<T extends object> extends WriteSignal<T> {
    set value(value: T) {
        super.setValue(value);
    }
    get value(): T {
        return nestedProxy(super.value, () => this.set(this.value));
    }
}

export type Refable<T> = T | Reference<T>;

/**
 * Creates a Reference<string> from a tagged templates
 *
 * ref\`Hello World\` => a Reference of Hello World
 *
 * ref\`Hello ${state.user}\` => a Reference of Hello and the static value of user
 *
 * ref\`Hello ${state.$user}\` => a Reference of Hello and the current value of user (Reference reacts on Reference)
 */
export function ref(data: TemplateStringsArray, ...expr: Refable<unknown>[]): Reference<string> {
    const empty = Symbol("empty");
    const merge = data.map((x, i) => [ x, expr[ i ] ?? empty ]).flat();

    return fromRefs(() => {
        let list = "";
        for (const iterator of merge) {
            if (<unknown>iterator === empty) continue;
            if (isRef(iterator))
                list += iterator.getValue();
            else
                list += iterator;
        }
        return list;
    });
}