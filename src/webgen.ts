import { Elements } from './classes/Elements';
import { Functions } from './classes/Functions';
import { ProfileData } from './classes/ProfileData';
import { Style } from './classes/Style';
import { SupportedThemes } from './classes/SupportedThemes';

class Script
{
    load(url: string)
    {
        var script = document.createElement("script")
        script.type = "text/javascript";
        return new Promise(function (resolve, reject)
        {
            script.onload = function ()
            {
                resolve();
            };
            script.src = url;
            document.getElementsByTagName("head")[ 0 ].append(script);
        });
    }
}

class Config
{
    defaultBackground: SupportedThemes = SupportedThemes.notset
}

enum databaseType
{
    lswsp,
    lsREST
}

export class WebGen
{
    style: Style = new Style();
    script: Script = new Script();
    config: Config = new Config();
    functions: Functions = new Functions();
    elements: Elements = new Elements(this.style);

    supported: typeof SupportedThemes = SupportedThemes;
    database: typeof databaseType = databaseType;
    ready: Function = () => { };
    enable(theme: SupportedThemes)
    {
        console.log("Loaded %cWebGen%cNPM", 'font-size: 2rem', 'font-size: 1.7rem;padding-left: 0.4rem;color:rgb(200,0,0)');
        this.ready();
        this.style.loadTheme(theme);
    }
}
export class DataConnect
{
    type: databaseType;
    url!: string;
    profile!: ProfileData;
    error = () => { };
    private gen: WebGen;
    constructor(type: databaseType, gen: WebGen)
    {
        this.type = type;
        this.gen = gen;
    }

    login(password: string, email: string)
    {
        return new Promise((done) =>
        {
            if (this.type == databaseType.lsREST)
            {
                this.gen.functions.request({
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
    async loginWindow(password: HTMLInputElement, email: HTMLInputElement, url: HTMLInputElement, errormsg: HTMLElement)
    {
        this.url = url.value;
        await this.login(password.value, email.value);
    }
}