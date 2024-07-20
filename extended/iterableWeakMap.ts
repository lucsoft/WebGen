// deno-lint-ignore no-explicit-any
export class IterableWeakMap<T extends Record<keyof any, unknown>[]> {
    #weakMap = new WeakMap();
    // deno-lint-ignore no-explicit-any
    #refSet = new Set<WeakRef<any>>();
    #finalizationGroup = new FinalizationRegistry(IterableWeakMap.#cleanup);

    // deno-lint-ignore no-explicit-any
    static #cleanup({ set, ref }: { set: Set<WeakRef<any>>, ref: WeakRef<any>; }) {
        set.delete(ref);
    }

    constructor(iterable: Iterable<T>) {
        for (const [ key, value ] of iterable) {
            this.set(key, value);
        }
    }

    // deno-lint-ignore no-explicit-any
    set(key: any, value: any) {
        const ref = new WeakRef(key);

        this.#weakMap.set(key, { value, ref });
        this.#refSet.add(ref);
        this.#finalizationGroup.register(key, {
            set: this.#refSet,
            ref
        }, ref);
    }

    // deno-lint-ignore no-explicit-any
    get(key: any) {
        const entry = this.#weakMap.get(key);
        return entry && entry.value;
    }

    // deno-lint-ignore no-explicit-any
    delete(key: any) {
        const entry = this.#weakMap.get(key);
        if (!entry) {
            return false;
        }

        this.#weakMap.delete(key);
        this.#refSet.delete(entry.ref);
        this.#finalizationGroup.unregister(entry.ref);
        return true;
    }

    *[ Symbol.iterator ]() {
        for (const ref of this.#refSet) {
            const key = ref.deref();
            if (!key) continue;
            const { value } = this.#weakMap.get(key);
            yield [ key, value ];
        }
    }

    entries() {
        return this[ Symbol.iterator ]();
    }

    *keys() {
        for (const [ key ] of this) {
            yield key;
        }
    }

    *values() {
        for (const [ , value ] of this) {
            yield value;
        }
    }
}