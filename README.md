<img src="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/assets/webgen.svg" width="25%" style="margin-bottom: 1rem">

# WebGen 2.0

A SwiftUI-like Webframework

## Getting Started

```ts
// Create a mod.ts file
import { Label, Body, WebGen } from "https://deno.land/x/webgen/mod.ts";

WebGen();
Body(
    Label("Hello World!")
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
