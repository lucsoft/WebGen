<img src="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/assets/webgen.svg" width="25%" style="margin-bottom: 1rem">

# WebGen 2.0

A SwftUI-like Webframework

## Getting Started

```ts
// Create a mod.ts file
import { PlainText, View, WebGen } from "https://deno.land/x/webgen/mod.ts";

WebGen();
View(() => PlainText("Hello World!")).appendOn(document.body);
```

Use a Builder

```ts
// Create a serve.ts file
import { serve } from "https://deno.land/x/esbuild_serve/mod.ts";

serve({
    pages: {
        "index": "./mod.ts",
    },
});
```

Create your HTML (templates/index.html)

```html
<link rel="stylesheet" href="index.css">
<script src="index.js"></script>
```

Run!

```
deno run -A --no-check serve.ts
```
