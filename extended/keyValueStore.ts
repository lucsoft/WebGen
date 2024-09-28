export async function createKeyValue<T>(collectionName: string) {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("webgen-keyval");

        request.onerror = () => {
            reject(new Error("Failed to open IndexedDB"));
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onupgradeneeded = function () {
            request.result.createObjectStore(collectionName);
        };

    });

    // Set a value in the map
    const set = (key: string, value: T | undefined) => {
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([ collectionName ], "readwrite");
            const store = transaction.objectStore(collectionName);

            transaction.onerror = () => {
                reject(new Error("Error in IndexedDB transaction"));
            };

            transaction.oncomplete = () => {
                resolve();
            };

            store.put(value, key);
        });
    };

    // Get a value from the map
    const get = (key: string) => {
        return new Promise<T>((resolve, reject) => {
            const transaction = db.transaction([ collectionName ], "readonly");
            const store = transaction.objectStore(collectionName);

            const request = store.get(key);

            request.onerror = () => {
                reject(new Error("Error retrieving value from IndexedDB"));
            };

            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    };


    // Get a value from the map
    const has = (key: string) => {
        return new Promise<boolean>((resolve, reject) => {
            const transaction = db.transaction([ collectionName ], "readonly");
            const store = transaction.objectStore(collectionName);

            const request = store.get(key);

            request.onerror = () => {
                reject(new Error("Error retrieving value from IndexedDB"));
            };

            request.onsuccess = () => {
                resolve(request.result !== undefined);
            };
        });
    };

    // Clear the keyvalue
    const clear = () => {
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([ collectionName ], "readwrite");
            const store = transaction.objectStore(collectionName);

            const request = store.clear();

            request.onerror = () => {
                reject(new Error("Error clearing IndexedDB store"));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    };

    // Delete a key from the map
    const remove = (key: string) => {
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction([ collectionName ], "readwrite");
            const store = transaction.objectStore(collectionName);

            const request = store.delete(key);

            request.onerror = () => {
                reject(new Error("Error deleting key from IndexedDB"));
            };

            request.onsuccess = () => {
                resolve();
            };
        });
    };

    return {
        set,
        get,
        has,
        clear,
        remove
    };
}