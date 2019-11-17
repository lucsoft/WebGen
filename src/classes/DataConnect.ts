import { WebGen } from '../webgen';
import { IDTokenAuth, ProfileData } from './ProfileData';

export enum ProtocolDC
{
    lsWS,
    lsREST
}

export class DataConnect
{
    private type: ProtocolDC;
    url!: string;
    profile: ProfileData = new ProfileData();
    ws!: WebSocket;
    error = () => { };
    private gen: WebGen;
    constructor(type: ProtocolDC, gen: WebGen)
    {
        this.type = type;
        this.gen = gen;
    }

    login(password: string, email: string)
    {
        return new Promise((done) =>
        {
            if (this.type == ProtocolDC.lsREST)
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
            } else if (this.type == ProtocolDC.lsWS)
            {
                this.initWebSocket(password, email);
            }
        });
    }
    private initWebSocket(password: string, email: string)
    {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = (x) =>
        {
            try
            {
                const repo = JSON.parse(x.data);
                if (repo.login == "require authentication")
                {
                    this.ws.send(JSON.stringify({
                        action: "login",
                        type: "client",
                        email,
                        password
                    }));
                } else if (repo.login == false)
                {
                    this.logout();
                } else if (repo.login == true)
                {
                    this.profile.auth = repo.client;
                    this.profile.user.email = email;
                    this.updateCurrentUser();
                } else if (repo[ "client" ] && repo[ "client" ][ "id" ] == this.profile.auth.id)
                {
                    this.profile.user.icon = repo.client.icon;
                    this.profile.user.createDate = repo.client.createDate;
                    this.profile.user.homes = repo.client.createDate;
                    this.profile.user.type = repo.client.type;
                    this.profile.user.permissions = repo.client.permissions;
                    this.profile.user.id = repo.client.id;
                    this.profile.modules = repo.modules;
                    this.onLogin();
                } else if (repo.type == "sync")
                {
                    this.onSync(repo.data.type, repo.data);
                }
            } catch (error)
            {
                console.error(error);
            }
        }
        this.ws.onclose = this.onLogout();
    }
    onLogin: Function = () => { console.log('DataConnect', 'login') };
    onLogout: Function = () => { console.log('DataConnect', 'logout') };
    onSync: Function = (type: string, data: string) => { console.log('DataConnect', 'sync', type, data) }
    logout()
    {
        this.onLogout();
    }
    updateCurrentUser()
    {
        if (this.type == ProtocolDC.lsWS)
        {
            this.ws.send(JSON.stringify({
                action: "account",
                target: {
                    user: "@me",
                    data: "all"
                },
                auth: this.profile.auth
            }))
        }
    }
    triggerCommand(type: string, data: string)
    {
        if (this.type == ProtocolDC.lsWS)
        {
            this.ws.send(JSON.stringify({
                action: "trigger",
                type,
                data,
                auth: this.profile.auth
            }))
        }
    }
    async loginWindow(password: HTMLInputElement, email: HTMLInputElement, url: HTMLInputElement, errormsg: HTMLElement)
    {
        this.url = url.value;
        await this.login(password.value, email.value);
    }
}