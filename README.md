<img src="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/assets/webgen.svg" width="25%" style="margin-bottom: 1rem">

# WebGen 2.0

A SwiftUI-like Web library

## Getting Started

```ts
// Create a mod.ts file
import { appendBody, Label, WebGenTheme } from "https://deno.land/x/webgen/mod.ts";

appendBody(
    WebGenTheme(
        Label("Hello World!")
    )
);
```

```ts
// Create a serve.ts file
import { serve } from "https://deno.land/x/esbuild_serve/mod.ts";

serve({
    pages: {
        "index": "mod.ts",
    },
});
```

```
deno run -A serve.ts
```

Done! Have fun! More docs will follow

## Architecture

WebGen is build around the 4 main components:

- **Core API**: Bringing layouting, the webgen component pattern and state management.
- **Navigation API**: Build Applications with multiple pages and navigation based on the global URL and the Navigation API.
- **Components API**: A set of prebuild components like Button, Checkbox, Image, List, Sheets.
- **Extended API**: Provides additional features like a scheduler, a network issue resilient fetch/websocket API.