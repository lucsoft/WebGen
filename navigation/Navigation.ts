import "https://esm.sh/v135/@types/dom-navigation@1.0.4/index.d.ts";
import { sortBy } from "jsr:@std/collections@^1.0.0";
import { asRef, asRefArray } from "../core/state.ts";

export const PageIsLoading = asRef(false);

export type NavigationEntry = {
    weight: number;
    intercept: (url: URL, event: NavigateEvent) => boolean | void;
};

export const NavigationRegistry = asRefArray<NavigationEntry>([]);

function shouldNotIntercept(navigationEvent: NavigateEvent) {
    return (
        // If this is just a hashChange,
        // just let the browser handle scrolling to the content.
        navigationEvent.hashChange ||
        // If this is a download,
        // let the browser perform the download.
        navigationEvent.downloadRequest ||
        // If this is a form submission,
        // let that go to the server.
        navigationEvent.formData ||
        // If this is a reload,
        // let the browser handle it.
        navigationEvent.navigationType === "reload"
    );
}

declare global {
    // deno-lint-ignore no-var
    var navigation: Navigation;
}

navigation.addEventListener('navigate', navigateEvent => {
    if (shouldNotIntercept(navigateEvent)) return;
    PageIsLoading.setValue(true);

    const url = new URL(navigateEvent.destination.url);

    for (const entry of sortBy(NavigationRegistry.getValue(), it => it.weight)) {
        const result = entry.intercept(url, navigateEvent);
        if (result === false) return;
    }
});

navigation.addEventListener('navigatesuccess', () => {
    PageIsLoading.setValue(false);
});

navigation.addEventListener('navigateerror', event => {
    PageIsLoading.setValue(false);
    console.debug(`Failed to load page: ${event.message}`);
});