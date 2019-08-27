console.log("Loaded %cWebGen%cGitHub", 'font-size: 2rem', 'font-size: 2rem;padding-left: 0.5rem;color:gold');

var web = {};
web.style = {};
web.style.load = (theme) => {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.onload = function () { resolve(); }
        link.setAttribute("href", `https://api.lucsoft.de/webgen/css/${theme.toLowerCase()}.css`);
        document.getElementsByTagName("body")[0].appendChild(link);
    });
};
web.style.loadComplex = (url) => {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.onload = function () { resolve(); }
        link.setAttribute("href", url);
        document.getElementsByTagName("body")[0].appendChild(link);
    });
};
web.script = {};
web.script.load = (url) => {
    var script = document.createElement("script")
    script.type = "text/javascript";
    return new Promise(function (resolve, reject) {
        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    resolve();
                }
            };
        } else {  //Others
            script.onload = function () {
                resolve();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    });


}
web.script.loadModule = async (id) => {
    console.log("Loaded Module: " + id);
    await web.script.load(`https://api.lucsoft.de/webgen/module/${id}.js`);
};
web.config = {};
web.config.defaultBackground = "";
web.config.defaultCSS = ["master", "unit"];
web.config.layouts = ["page"];

web.enable = async () => {
    if (web.config.defaultBackground != "") {
        web.config.defaultCSS.push(web.config.defaultBackground);
    }
    await web.script.load("https://api.lucsoft.de/webgen/js/jquery.js");
    await web.script.load("https://api.lucsoft.de/webgen/js/elements.js");
    web.script.loadModule("unit");
    await web.style.loadComplex("https://fonts.googleapis.com/css?family=Material+Icons+Round|Material+Icons|Roboto:200,300,100");
    web.config.defaultCSS.forEach(async e => {
        await web.style.load(e);
    });
    web.config.layouts.forEach(e => {
        web.elements.layout(e);
    });
    console.log("Loaded CSS: " + web.config.defaultCSS);
    console.log("Loaded JS: jquery,elements,unit");
};