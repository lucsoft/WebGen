import { delay } from "https://deno.land/std@0.140.0/async/delay.ts";
import { Button, TextInput, PlainText, View, WebGen, DropDownInput, Wizard, Page, Vertical, Horizontal, Center } from "../src/webgen.ts";

WebGen();


const wizard = Wizard({
    submitAction: () => {

    },
    buttonArrangement: "space-between",
}, () => [
    Page({
        text: "hi",
        select: undefined
    }, (data) => [
        PlainText("Page 1"),
        PlainText("Input (when this page was first drawn): " + data.text),
        Center(
            Vertical(
                TextInput("text", "Input", "live")
                    .sync(data, "text"),
                DropDownInput("Selection", [ "wow", "mew" ])
                    .sync(data, "select"),
                Button("Add hi to text input")
                    .onClick(_ => data.text += " hi"),
            ).setGap("1rem")
        ).setMargin("5rem 0 0 0")
    ]).setValidator((e) => e.object({
        text: e.string().refine(x => x.startsWith("wow"), { message: "Input: Should start with wow" })
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