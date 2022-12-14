import { Grid, Image, View, WebGen } from "../src/webgen.ts";
import image from "./test.png";
import "./image.css";
import { delay } from "https://deno.land/std@0.167.0/async/delay.ts";

WebGen();
const blobImage = await fetch(image)
    .then(x => x.blob());
const url = URL.createObjectURL(blobImage);
document.body.append(
    Grid(
        Image(image, "A cat with a backpack."),
        Image({
            type: "direct", source: () => fetch(image)
                .then(x => x.blob())
                .then(async x => {
                    await delay(3000);
                    return x;
                })
        }, "A cat with a backpack."),
        Image({
            type: "loading"
        }, "A cat with a backpack."),
        View<{ counter: number; }>(({ state, update, use }) => {
            use(Image({
                type: "uploading",
                blobUrl: url,
                filename: "cute_cat.png",
                percentage: ((state.counter ?? 0) % 1000) / 10
            }, "A cat with a backpack."));
            setTimeout(() => update({ counter: (state.counter ?? 0) + 52 }), 100);
        }).addClass("test").asComponent(),
        Image({
            type: "waiting-upload",
            blobUrl: url,
            filename: "cute_cat.png"
        }, "A cat with a backpack.")
    ).setDynamicColumns().draw()
);