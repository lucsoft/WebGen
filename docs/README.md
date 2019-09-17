# WebGen Framework now in simple

WebGen Framework loads everything it needs

like for a bigTile it requires elements.css

## Index.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Example Page</title>
        <script src="https://api.lucsoft.de/webgen/webgen"></script>
        <script src="page"></script>
    </head>
    <body></body>
</html>
```

## page.js

```js
web.config.defaultBackground = "blur";
web.enable();
web.ready = async () => {
    web.elements.add().bigTitle({ title: "Hello World", subtitle: "Welcome to WebGen Framework", subtitleposx: "0" });
}
```