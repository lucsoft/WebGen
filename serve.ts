import { serve } from "https://deno.land/x/esbuild_serve@0.3.0/mod.ts";

serve({
    port: 8100,
    pages: {
        "index": "demo/index.ts",
        "wizard/index": "demo/wizard.ts",
    }
});
