import { SupportedThemes, WebGen } from '../src/webgen';

var web = new WebGen();

web.ready = () =>
{
    const {
        switch: Switch,
        list: List,
        multiStateSwitch: MultiStateSwitch,
        action
    } = web.elements.none().components;

    web.elements.body().title({
        type: "big",
        title: "Big Title"
    }).title({
        type: "big",
        title: "Big Title",
        subtitle: "Sub Title"
    }).title({
        type: "small",
        title: "Title"
    }).title({
        type: "small",
        title: "Title",
        subtitle: "Subtitle"
    }).buttons({
        big: true,
        list: [
            {
                text: 'wow',
                onclick: () => { console.log('yaay') }
            },
            {
                text: 'such buttons',
                onclick: () => { console.log('yaay') }
            }
        ]
    }).buttons({
        big: false,
        list: [
            {
                text: 'wow',
                onclick: () => { console.log('yaay') }
            },
            {
                text: 'such buttons',
                onclick: () => { console.log('yaay') }
            }
        ]
    }).pageTitle({
        text: "Hello World!",
        maxWidth: "35rem"
    }).window({
        title: 'miau',
        content: List({},
            {
                left: "Example Switch",
                actions: [
                    {
                        type: "get_app", click: () =>
                        {
                            web.elements.fixedWindow(true, true).buttons({
                                big: false,
                                list: [
                                    {
                                        text: "close",
                                        onclick: () => web.elements.fixedWindow(false)
                                    }
                                ]
                            })
                        }
                    },
                ]
            },
            {
                left: "Example Actions",
                right: Switch({
                    disabled: false,
                    checked: false,
                    onClick: () => web.elements.notify("Updating"),
                    onAnimationComplete: () => action(document.body.querySelector("switch")?.parentElement ?? document.body, "disabled", true)
                })
            },
            {
                left: "MultiStateSwitch",
                right: MultiStateSwitch("small",
                    { title: "gray", action: () => web.style.handleTheme(SupportedThemes.gray) },
                    { title: "dark", action: () => web.style.handleTheme(SupportedThemes.dark) },
                    { title: "white", action: () => web.style.handleTheme(SupportedThemes.white) },
                    { title: "blur", action: () => web.style.handleTheme(SupportedThemes.blur) },
                    { title: "auto", action: () => web.style.handleTheme(SupportedThemes.auto) },
                )
            }
        )
        ,
        maxWidth: "35rem"
    }).search({
        type: "smart",
        mode: "showBegin",
        notfound: "No Entries",
        maxWidth: "35rem",
        actions: {
            remove: (entry) =>
            {
                console.log(entry);
            },
            edit: (entry) =>
            {
                console.log(entry);
            },
            download: (entry) =>
            {
                console.log(entry);
            }
        },
        index: [
            {
                id: "1",
                name: "lol",
                category: "test",
                tags: [ "wow", "super" ]
            }, {
                id: "2",
                name: "was"
            }, {
                id: "1",
                name: "lol"
            }, {
                id: "2",
                name: "was"
            }, {
                id: "1",
                name: "lol"
            }, {
                id: "2",
                name: "was"
            }, {
                id: "1",
                name: "lol"
            }, {
                id: "2",
                name: "was"
            }
        ]
    }).login({
        login: () => { },
        password: "Login"
    }).note({
        text: "Hello World",
        type: "developer",
        maxWidth: "35rem"
    }).cardButtons({
        maxWidth: "35rem",
        list: [
            {
                title: "Virtual Lampad dasdasdasdasd",
                active: true,
                id: "vdLa01",
                onClick: (toggle, currentState) =>
                {
                    if (currentState)
                        toggle('Off');
                    else
                        toggle('On');

                }
            },
            {
                title: "Virtual Outlet",
                value: "subtitles",
                id: "vdOu01",
                onClick: (toggle, currentState) =>
                {
                    if (currentState)
                        toggle('Off');
                    else
                        toggle('On');

                }
            },
            {
                title: "Virtual Lamp",
                active: false,
                icon: 'https://hmsys.de/lightOff',
                id: "vdDo01",
                onClick: (toggle, currentState) =>
                {
                    if (currentState)
                        toggle('Off', 'https://hmsys.de/lightOff');
                    else
                        toggle('On', 'https://hmsys.de/lightOn');

                }
            }
        ]
    }).splitView({
        right: [
            web.elements.none().note({
                text: "Splited Views",
                type: "fire"
            })
        ],
        maxWidth: "35rem",
        theme: "modern",
        left: [
            web.elements.none().cards({
                style: "small",
                columns: "1",
                hidden: false,
                cards: [
                    {
                        subtitle: "was",
                        title: "test"
                    }
                ]
            })
        ]
    }).cards({
        style: "modern",
        columns: "auto",
        maxWidth: "35rem",
        cards: [
            {
                align: "right",
                title: "WebGen",
                subtitle: "Typescript — NPM"
            },
            {
                align: "right",
                title: "WebGen",
                subtitle: "Typescript — NPM",
                description: "WebGen is a UI/Websocket framework to create fast Webtool or Website like this one"
            }
        ]
    });
};
document.addEventListener("DOMContentLoaded", () => web.enable(SupportedThemes.auto));