import { serve } from "https://deno.land/x/esbuild_serve@1.2.2/mod.ts";

serve({
    port: 8100,
    pages: {
        "index": "demo/index.ts",
        "wizard/index": "demo/wizard.ts",
        "image/index": "demo/image.ts",
        "layer/index": "demo/layer.ts",
    },
    poylfills: [
        "https://unpkg.com/construct-style-sheets-polyfill"
    ]
});
