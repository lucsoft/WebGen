import { Elements } from './lib/Elements';
import { Style } from './lib/Style';
import { SupportedThemes } from './lib/SupportedThemes';

export { DataConnect, ProtocolDC } from './lib/DataConnect';
export { WebFunctions } from './lib/Functions';
export { EmailPasswordAuth, IDTokenAuth, ProfileData, User } from './lib/ProfileData';
export { SupportedThemes } from './lib/SupportedThemes';


class Script
{
    load(url: string)
    {
        var script = document.createElement("script")
        script.type = "text/javascript";
        return new Promise(function (resolve,)
        {
            script.onload = () => resolve();
            script.src = url;
            document.getElementsByTagName("head")[ 0 ].append(script);
        });
    }
}


export class WebGen
{
    style: Style = new Style();
    script: Script = new Script();
    elements: Elements = new Elements(this.style);
    ready: Function = () => { };
    enable(theme: SupportedThemes)
    {
        console.log("Loaded %cWebGen%cNPM", 'font-size: 2rem', 'font-size: 1.7rem;padding-left: 0.4rem;color:rgb(200,0,0)');
        this.ready();
        this.style.handleTheme(theme);
    }
}
