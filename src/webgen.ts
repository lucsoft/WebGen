import { Elements } from './classes/Elements';
import { Functions } from './classes/Functions';
import { Style } from './classes/Style';
import { SupportedThemes } from './classes/SupportedThemes';

export { ElementResponse } from './classes/ElementsResponse';
export { DataConnect, ProtocolDC } from './classes/DataConnect';
export { SupportedThemes } from './classes/SupportedThemes';
export { EmailPasswordAuth, IDTokenAuth, ProfileData, User } from './classes/ProfileData';
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

export class WebGen
{
    style: Style = new Style();
    script: Script = new Script();
    config: Config = new Config();
    functions: Functions = new Functions();
    elements: Elements = new Elements(this.style);

    supported: typeof SupportedThemes = SupportedThemes;
    ready: Function = () => { };
    enable(theme: SupportedThemes)
    {
        console.log("Loaded %cWebGen%cNPM", 'font-size: 2rem', 'font-size: 1.7rem;padding-left: 0.4rem;color:rgb(200,0,0)');
        this.ready();
        this.style.loadTheme(theme);
    }
}
