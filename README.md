<img src="https://raw.githubusercontent.com/lucsoft-DevTeam/lucsoft.de/master/assets/webgen.svg" width="25%" style="margin-bottom: 1rem">

# WebGen 2.0

A SwiftUI-like Webframework

## Getting Started

```ts
// Create a mod.ts file
import { PlainText, View, WebGen } from "https://deno.land/x/webgen/mod.ts";

WebGen();
View(() => PlainText("Hello World!")).appendOn(document.body);
```

```ts
// Create a serve.ts file
import { serve } from "https://deno.land/x/esbuild_serve/mod.ts";

serve({
    pages: {
        "index": "./mod.ts",
    },
});
```

```html
<!-- Create a templates/index.html file  -->
<link rel="stylesheet" href="index.css">
<script src="index.js"></script>
```

```
deno run -A --no-check serve.ts
```

Done! Have fun! More docs will follow
