import 'babel-polyfill';

import { DataConnect, ProtocolDC, SupportedThemes, WebGen } from '../webgen';

var web: WebGen = new WebGen();

web.ready = () =>
{
    const webE = web.elements.add(web.functions.getBody()).bigTitle({
        title: "Big Title"
    }).next.bigTitle({
        title: "Big Title",
        subtitle: "Sub Title"
    }).next.title({
        title: "Title"
    }).next.title({
        title: "Title",
        subtitle: "Subtitle"
    }).next.buttons({
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
    }).next.buttons({
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
    }).next.pageTitle({
        text: "Hello World!",
        maxWidth: "35rem"
    }).next.window({
        title: 'miau',
        content: [ web.elements.add(document.body).tiny.cardProgress("test"), "hello world" ],
        maxWidth: "35rem"
    }).next.login({
        login: () => { },
        password: "Login"
    }).next.note({
        text: "Hello World",
        type: "developer",
        maxWidth: "31rem"
    }).next.player({
        img: "https://t2.genius.com/unsafe/300x0/https%3A%2F%2Fimages.genius.com%2Fe0b0e60b74e0b9efeb7aa1ff71b3fca6.597x597x1.png",
        onInput: () => { },
        small: false
    }).next.search({
        type: "default",
        maxWidth: "35rem",
        index: [
            {
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
            }, {
                id: "1",
                name: "lol"
            }, {
                id: "2",
                name: "was"
            }
        ]
    }).next.cardButtons({
        maxWidth: "35rem",
        list: [
            {
                title: "Virtual Lampad dasdasdasdasd",
                active: true,
                id: "vdLa01",
                onClick: (toggle, currentState, title, element) =>
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
                onClick: (toggle, currentState, title, element) =>
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
                onClick: (toggle, currentState, title, element) =>
                {
                    if (currentState)
                        toggle('Off', 'https://hmsys.de/lightOff');
                    else
                        toggle('On', 'https://hmsys.de/lightOn');

                }
            }
        ]
    }).next.splitView({
        right: [
            web.elements.add(web.functions.getBody()).note({
                text: "Splited Views",
                type: "fire"
            })
        ],
        maxWidth: "35rem",
        theme: "modern",
        left: [
            web.elements.add(web.functions.getBody()).cards({
                small: true,
                columns: "1",
                hidden: false,
                cards: [
                    {
                        id: "lol",
                        subtitle: "was",
                        title: "test"
                    }
                ]
            })
        ]
    });

    var data = new DataConnect(ProtocolDC.lsWS, web);
    data.url = "wss://eu01.hmsys.de";
    data.login("", "");
};
document.addEventListener("DOMContentLoaded", () => web.enable(SupportedThemes.blur));