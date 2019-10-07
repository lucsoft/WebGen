"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("./classes/Functions");
const Elements_1 = require("./classes/Elements");
const SupportedThemes_1 = require("./classes/SupportedThemes");
const Style_1 = require("./classes/Style");
class Script {
    constructor() {
    }
    load(url) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        return new Promise(function (resolve, reject) {
            script.onload = function () {
                resolve();
            };
            script.src = url;
            document.getElementsByTagName("head")[0].append(script);
        });
    }
}
class Config {
    constructor() {
        this.defaultBackground = SupportedThemes_1.SupportedThemes.notset;
    }
}
var databaseType;
(function (databaseType) {
    databaseType[databaseType["lswsp"] = 0] = "lswsp";
    databaseType[databaseType["lsREST"] = 1] = "lsREST";
})(databaseType || (databaseType = {}));
class WebGen {
    constructor() {
        this.style = new Style_1.Style();
        this.script = new Script();
        this.config = new Config();
        this.ready = () => { };
        this.supported = SupportedThemes_1.SupportedThemes;
        this.database = databaseType;
    }
    enable() {
        this.func = new Functions_1.Functions();
        this.ele = new Elements_1.Elements();
        this.ready();
    }
}
exports.WebGen = WebGen;
class DataConnect {
    constructor(type, gen) {
        this.error = () => { };
        this.type = type;
        this.gen = gen;
    }
    login(password, email) {
        return new Promise((done) => {
            if (this.type == databaseType.lsREST) {
                this.gen.func.request({
                    methode: "GET",
                    data: "",
                    error: () => console.log,
                    response: () => console.log,
                    url: this.url + "/users/@me",
                    header: [
                        {
                            name: "Authorization",
                            value: "Basic " + btoa(`${email}:${password}`)
                        }
                    ]
                });
            }
        });
    }
    async loginWindow(password, email, url, errormsg) {
        this.url = url.value;
        await this.login(password.value, email.value);
    }
}
exports.DataConnect = DataConnect;
