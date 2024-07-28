import { Signal } from "https://esm.sh/signal-polyfill@0.1.2";

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
        let oldValue = this.get();
        return listen(() => {
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

export class ReadSignal<T> extends Signal.Computed<T> implements Reference<T> {
    getValue(): T {
        return this.get();
    }
    get value(): T {
        return this.get();
    }
    listen(c: RefEvent<T>): { unlisten: () => void; } {
        let oldValue = this.get();
        return listen(() => {
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
        queueMicrotask(() => {
            pending = false;
            for (const s of watcher.getPending()) s.get();
            watcher.watch();
        });
    }
});

export function listen(callback: () => void): { unlisten: () => void; } {
    WEBGEN_LISTEN_COUNT++;
    if (WEBGEN_LISTEN_COUNT % 100 === 0) {
        console.debug("Leaking Listener? Found:", WEBGEN_LISTEN_COUNT);
    }
    let destructor: (() => void) | void;
    const computed = new Signal.Computed(() => { destructor?.(); destructor = callback(); });
    watcher.watch(computed);
    computed.get();
    return {
        unlisten: () => {
            WEBGEN_LISTEN_COUNT--;
            destructor?.();
            watcher.unwatch(computed);
        }
    };
}

/**
 * Converts a value or Ref to a Ref.
 *
 * A Ref is a special object that allows you to track and modify a value.
 * It provides methods to set and retrieve the value, as well as additional
 * functionality to convert and listen for value changes.
 * @param value The value or Ref to be converted.
 * @returns The converted Ref.
 */
export function asRef<T>(initValue: T, options?: Signal.Options<T>): WriteSignal<T> {
    return new WriteSignal(initValue, options);
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