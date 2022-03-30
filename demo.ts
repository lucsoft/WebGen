import { serve } from 'https://deno.land/x/esbuild@v0.14.29/mod.js';
import { httpImports } from "https://deno.land/x/esbuild_plugin_http_imports@v1.2.3/index.ts";
import { emptyDirSync } from "https://deno.land/std@0.132.0/fs/mod.ts";
emptyDirSync("dist")
Deno.copyFileSync("index.html", "dist/index.html")
console.log("🚀 WebServer @ http://localhost:8100")
serve({ port: 8100, servedir: ".", onRequest: ({ method, remoteAddress, path }) => console.log("📦", method, `http://localhost${path} from ${remoteAddress}`) }, {
    loader: {
        ".woff": "file",
        ".woff2": "file",
        ".html": "file"
    },
    plugins: [ httpImports({
        onCacheMiss: (path) => console.log("📡", "Loading", path),
        disableCache: true
    }) ],
    bundle: true,
    entryPoints: [ "demo/index.ts" ],
    minify: true,
    splitting: true,
    format: "esm",
    logLevel: "info"
})