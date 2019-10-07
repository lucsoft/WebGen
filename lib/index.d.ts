import { Functions } from "./classes/Functions";
import { Elements } from "./classes/Elements";
import { SupportedThemes } from "./classes/SupportedThemes";
import { Style } from "./classes/Style";
import { ProfileData } from "./classes/ProfileData";
declare class Script {
    constructor();
    load(url: string): Promise<unknown>;
}
declare class Config {
    defaultBackground: SupportedThemes;
}
declare enum databaseType {
    lswsp = 0,
    lsREST = 1
}
export declare class WebGen {
    style: Style;
    script: Script;
    config: Config;
    func: Functions;
    ready: Function;
    ele: Elements;
    supported: typeof SupportedThemes;
    database: typeof databaseType;
    enable(): void;
}
export declare class DataConnect {
    type: databaseType;
    url: string;
    profile: ProfileData;
    error: () => void;
    private gen;
    constructor(type: databaseType, gen: WebGen);
    login(password: string, email: string): Promise<unknown>;
    loginWindow(password: HTMLInputElement, email: HTMLInputElement, url: HTMLInputElement, errormsg: HTMLElement): Promise<void>;
}
export {};
