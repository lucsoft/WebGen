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
        document.getElementsByTagName("head")[0].appendChild(link);
    });
};
web.style.require = (name) => {
    if (!web.config.loadedCSS.includes(name)) {
        web.style.load(name);
    }
};
web.style.loadComplex = (url) => {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.onload = function () { resolve(); }
        link.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(link);
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
web.config = {};
web.config.defaultBackground = "";
web.config.loadedCSS = ["master", "unit"];
web.config.layouts = ["page"];
web.ready = () => { };
web.enable = async () => {
    if (web.config.defaultBackground != "") {
        web.config.loadedCSS.push(web.config.defaultBackground);
    }
    await web.script.load("https://api.lucsoft.de/webgen/js/jquery.js");
    await web.script.load(`https://api.lucsoft.de/webgen/module/unit.js`);
    await web.script.load("https://api.lucsoft.de/webgen/js/qunit.js");
    await web.script.load(`https://api.lucsoft.de/webgen/module/elements.js`);
    await web.script.load(`https://api.lucsoft.de/webgen/module/functions.js`);
    await web.style.loadComplex("https://fonts.googleapis.com/css?family=Material+Icons+Round|Material+Icons|Roboto:200,300,100");
    web.config.loadedCSS.forEach(async e => {
        await web.style.load(e);
    });
    web.config.layouts.forEach(e => {
        web.elements.layout(e);
    });
    console.log("Loaded CSS: " + web.config.loadedCSS + ",Google Fonts");
    console.log("Loaded JS: jquery,unit");

    unit.assert("Check Webservice").equal((response) => {
        getData("https://lucsoft.de/ping", (e) => {
            response(e, "lucsoft.de is up", "lucsoft.de is down");
        })
    });
    unit.assert(`Is 1 == "1"`).equal(1, "1");
    web.ready();
};