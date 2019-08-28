web.config.defaultBackground = "blur";
web.enable();
web.ready = async () => {
    web.func.addBackground("https://data.lucsoft.de/imgs/panda");
    web.func.addBackground("https://data.lucsoft.de/imgs/panda2");
    web.func.addBackground("https://data.lucsoft.de/imgs/panda3");
    web.func.setBackground();
    web.elements.add().bigTitle({ title: "Hello World", subtitle: "Welcome to WebGen Framework", subtitleposx: "0" });
}