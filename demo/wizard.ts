import { delay } from "https://deno.land/std@0.167.0/async/delay.ts";
import { Button, TextInput, PlainText, View, WebGen, DropDownInput, Wizard, Page, Vertical, Center, Reactive } from "../src/webgen.ts";

WebGen();


const wizard = Wizard({
    buttonAlignment: "top",
    submitAction: () => {

    },
    buttonArrangement: "space-between",
}, () => [
    Page({
        input: <string | undefined>undefined,
        select: undefined
    }, (data) => [
        PlainText("Page 1"),
        PlainText("Input (ondraw): " + data.input),
        Reactive(data, "input", () => PlainText("Input (reactive): " + data.input)),
        Center(
            Vertical(
                TextInput("text", "Input", "live")
                    .sync(data, "input"),
                DropDownInput("Selection", [ "wow", "mew" ])
                    .setValueRender(([ key ]) => key.toUpperCase())
                    .sync(data, "select"),
                Button("Add hi to text input")
                    .onClick(_ => data.input += " hi"),
            ).setGap("1rem")
        ).setMargin("5rem 0 0 0")
    ]).setValidator((e) => e.object({
        input: e.string().optional().refine(x => x && x.startsWith("wow"), { message: "should start with wow" }),
        das: e.string(),
        a: e.string()
    }).refine(async x => {
        await delay(1000);
        return x;
    })),
    Page({
        text: "hi"
    }, (data) => [
        PlainText("Wow1"),
        Button("Test").onClick(_ => data.text += " hi")
    ]).setValidator((e) => e.object({}).refine(async x => {
        await delay(1000);
        return x;
    })),
    Page({
        text: "hi"
    }, (data) => [
        PlainText("Wow2"),
        Button("Test").onClick(_ => data.text += " hi")
    ]).setValidator((e) => e.object({}).refine(async x => {
        await delay(1000);
        return x;
    })),
    Page({}, (data) => [
        PlainText("Wow3")
    ])
]);
View(() => wizard).appendOn(document.body);