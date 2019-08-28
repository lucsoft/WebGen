console.log("Loaded %cWebGen%cGitHub", 'font-size: 2rem', 'font-size: 2rem;padding-left: 0.5rem;color:gold');

var web = {};
web.style = {};
web.oncommand = (ge) => { console.log("Event: onCommand = " + ge); };
web.style.load = (theme, sub = ".css", url = "https://api.lucsoft.de/webgen/css/") => {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.onload = function () { resolve(); }
        link.setAttribute("href", `${url}${theme.toLowerCase()}${sub}`);
        document.getElementsByTagName(theme == "blur" || theme == "white" || theme == "dark" ? "theme" : "csslinks")[0].appendChild(link);
    });
};
web.style.require = (name) => {
    if (!web.config.loadedCSS.includes(name)) {
        //web.style.load(name);
        web.config.loadedCSS.push(name);
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
web.config.loadedCSS = ["master", "cards", "elements", "search", "unit"];
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
    $("head").append("<csslinks></csslinks>");
    $("head").append("<theme></theme>");
    $("body").append('<div id="qunit" class="hide"></div>');
    for (let index = 0; index < web.config.loadedCSS.length; index++) {
        const e = web.config.loadedCSS[index];
        await web.style.load(e);

    }
    web.config.layouts.forEach(e => {
        web.elements.layout(e);
    });
    console.log("Loaded CSS: " + web.config.loadedCSS + ",Google Fonts");
    console.log("Loaded JS: jquery,unit");

    unit.assert("Check Webservice", "WebGen").equal(async (response) => {
        response(await web.func.get("https://lucsoft.de/ping"), "Service is up", "Service is down");
    });
    web.ready();
};