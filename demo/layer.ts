import { Horizontal, Layer, PlainText, Vertical, View, WebGen } from "../mod.ts";

WebGen({
    primiaryColor: "hsl(256, 34%, 40%)",
});

View(() => Horizontal(
    Vertical(
        Layer(
            PlainText("Hello World! 5")
                .setFont(1.5).setPadding("0 .5rem"),
            5
        ).setBorderRadius("complete"),
        Layer(
            PlainText("Hello World! 4")
                .setFont(1.5).setPadding("0 .5rem"),
            4
        ).setBorderRadius("large"),
        Layer(
            PlainText("Hello World! 3")
                .setFont(1.5).setPadding("0 .5rem"),
            3
        ).setBorderRadius("mid"),
        Layer(
            PlainText("Hello World! 2")
                .setFont(1.5).setPadding("0 .5rem"),
            2
        ).setBorderRadius("tiny"),
        Layer(
            PlainText("Hello World! 1")
                .setFont(1.5).setPadding("0 .5rem"),
            1
        ).setBorderRadius("tiny"),
        Layer(
            PlainText("Hello World! 0")
                .setFont(1.5).setPadding("0 .5rem"),
            0
        ).setGrow()
    ).setGap("2.5rem").setGrow(),
    Vertical(
        Layer(
            PlainText("Hello World! 5")
                .setFont(1.5).setPadding("0 .5rem"),
            5, "tint"
        ).setBorderRadius("complete"),
        Layer(
            PlainText("Hello World! 4")
                .setFont(1.5).setPadding("0 .5rem"),
            4, "tint"
        ).setBorderRadius("large"),
        Layer(
            PlainText("Hello World! 3")
                .setFont(1.5).setPadding("0 .5rem"),
            3, "tint"
        ).setBorderRadius("mid"),
        Layer(
            PlainText("Hello World! 2")
                .setFont(1.5).setPadding("0 .5rem"),
            2, "tint"
        ).setBorderRadius("tiny"),
        Layer(
            PlainText("Hello World! 1")
                .setFont(1.5).setPadding("0 .5rem"),
            1, "tint"
        ).setBorderRadius("tiny"),
        Layer(
            PlainText("Hello World! 0")
                .setFont(1.5).setPadding("0 .5rem"),
            0, "tint"
        ).setGrow(),
    ).setGap("2.5rem").setGrow(),
    Vertical(
        Layer(
            PlainText("Hello World! 5")
                .setFont(1.5).setPadding("0 .5rem"),
            5, "tint-shadow"
        ).setBorderRadius("complete"),
        Layer(
            PlainText("Hello World! 4")
                .setFont(1.5).setPadding("0 .5rem"),
            4, "tint-shadow"
        ).setBorderRadius("large"),
        Layer(
            PlainText("Hello World! 3")
                .setFont(1.5).setPadding("0 .5rem"),
            3, "tint-shadow"
        ).setBorderRadius("mid"),
        Layer(
            PlainText("Hello World! 2")
                .setFont(1.5).setPadding("0 .5rem"),
            2, "tint-shadow"
        ).setBorderRadius("tiny"),
        Layer(
            PlainText("Hello World! 1")
                .setFont(1.5).setPadding("0 .5rem"),
            1, "tint-shadow"
        ).setBorderRadius("tiny"),
        Layer(
            PlainText("Hello World! 0")
                .setFont(1.5).setPadding("0 .5rem"),
            0, "tint-shadow"
        ).setGrow(),
    ).setGap("2.5rem").setGrow()
).setGap("2.5rem").setPadding("2.5rem")).appendOn(document.body);