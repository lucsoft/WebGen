import
{
    SupportedThemes, WebGen,
    cards
} from '../src/webgen';

var web = new WebGen();

const {
    switch: Switch,
    list: List,
    multiStateSwitch: MultiStateSwitch,
    action,
    dropdown,
    input
} = web.elements.none().components;
const themeArray = Object.values(SupportedThemes).filter(x => x !== SupportedThemes.notset);
const themeArrayWithActions = themeArray.map((x) => ({ title: x, action: () => web.style.handleTheme(x) }));
const customDropDown = dropdown({ default: 4, small: true }, ...themeArrayWithActions);
web.style.getImage = () => 'https://cdn.pixabay.com/photo/2019/07/01/14/30/squirrel-4310069_1280.jpg';
web.style.hookThemeChange((theme, isAuto) =>
{
    if (isAuto)
        action(customDropDown, "value", themeArray.length - 1);
    else
        action(customDropDown, "value", themeArray.findIndex((x) => x == theme));
});
web.ready = () =>
{
    web.elements.body()
        .title({
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
        })
        .buttons({
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
        }).cards({ minColumnWidth: 14 },
            cards.defaultCard({ title: "supr", small: true }),
            cards.defaultCard({ title: "supr", subtitle: "supr" }),
            cards.modernCard({
                title: "Some Text",
                subtitle: "Some other Text",
                icon: `data:image/svg+xml,%3Csvg width='74' height='70' viewBox='0 0 74 70' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0.864655' width='72.6316' height='70' rx='12.8947' fill='url(%23paint0_linear)'/%3E%3Cpath d='M50.8891 51.6549C50.8891 52.1781 50.465 52.6021 49.9419 52.6021L45.6676 52.6021L24.4235 52.6021C23.9004 52.6021 23.4763 52.1781 23.4763 51.6549L23.4763 18.3329C23.4763 17.8098 23.9004 17.3857 24.4235 17.3857L45.3141 17.3857C45.5421 17.3857 45.7625 17.4679 45.9347 17.6173L50.5625 21.6302C50.7699 21.8102 50.8891 22.0713 50.8891 22.3459L50.8891 51.6549ZM29.645 21.9135C29.1219 21.9135 28.6978 22.3376 28.6978 22.8607L28.6978 47.1271C28.6978 47.6502 29.1219 48.0743 29.645 48.0743L44.7204 48.0743C45.2435 48.0743 45.6676 47.6502 45.6676 47.1271L45.6676 22.8607C45.6676 22.3376 45.2435 21.9135 44.7204 21.9135L29.645 21.9135Z' fill='white'/%3E%3Cpath d='M53.2946 49.5207C53.3748 50.0377 53.0201 50.5172 52.5023 50.5918L48.2757 51.2004L27.2657 54.2258C26.7479 54.3003 26.2631 53.9417 26.183 53.4247L21.0708 20.4672C20.9907 19.9502 21.3454 19.4707 21.8632 19.3961L42.5229 16.4212C42.7488 16.3887 42.9798 16.4387 43.1733 16.562L48.3658 19.8718C48.5984 20.0201 48.7561 20.2609 48.7982 20.532L53.2946 49.5207ZM27.722 23.1306C27.2042 23.2052 26.8494 23.6847 26.9296 24.2016L30.6525 48.203C30.7327 48.72 31.2174 49.0786 31.7352 49.004L46.6435 46.8573C47.1613 46.7827 47.5161 46.3032 47.4359 45.7863L43.713 21.7849C43.6328 21.2679 43.1481 20.9093 42.6303 20.9839L27.722 23.1306Z' fill='white' fill-opacity='0.35'/%3E%3Cpath d='M55.3237 47.0604C55.4816 47.5591 55.2029 48.0834 54.7012 48.2315L50.6172 49.4369L30.3076 55.4314C29.8059 55.5795 29.2711 55.2952 29.1131 54.7965L19.018 22.9192C18.8601 22.4205 19.1388 21.8961 19.6405 21.748L39.6094 15.8541C39.8291 15.7893 40.0663 15.8058 40.2773 15.9005L45.9175 18.4327C46.1695 18.5458 46.3615 18.7604 46.4441 19.0212L55.3237 47.0604ZM26.0045 24.6052C25.5027 24.7533 25.224 25.2776 25.382 25.7764L32.7341 48.9922C32.8921 49.491 33.4269 49.7752 33.9286 49.6271L48.3372 45.3744C48.839 45.2263 49.1177 44.7019 48.9597 44.2032L41.6076 20.9873C41.4496 20.4886 40.9148 20.2044 40.4131 20.3525L26.0045 24.6052Z' fill='white' fill-opacity='0.07'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='37.1804' y1='0' x2='37.1804' y2='70' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235DB5F5'/%3E%3Cstop offset='1' stop-color='%2306539A'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E`,
                description: "Nice text"
            }),
            cards.richCard({
                title: "Hello World!",
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
                        left: input({ placeholder: "Some text", width: "8rem" }),
                        right: customDropDown
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
                buttons: [
                    {
                        text: "Okay",
                        color: "normal",
                        action: () => { }
                    },
                    {
                        text: "Exit",
                        color: "red",
                        action: () => { }
                    }
                ]
            }),
            cards.loginCard({
                email: {
                    text: "Email"
                },
                password: {
                    text: "Password"
                },
                errorMessage: 'Falsche Anmeldedaten',
                makeLogin: () => new Promise((complete) =>
                {
                    setTimeout(() => complete(false), 5000);
                })
            }),
            cards.noteCard({
                title: 'Hello Developers',
                icon: "👨‍💻"
            }),
            cards.searchCard({
                width: 2,
                type: "smart",
                mode: "showBegin",
                notfound: "No Entries",
                maxWidth: "35rem",
                actions: {
                    close: () =>
                    {

                    },
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
                        name: "was",
                        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQiIGhlaWdodD0iNzEiIHZpZXdCb3g9IjAgMCA3NCA3MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CjxyZWN0IHg9IjAuMzA4MjI4IiB3aWR0aD0iNzMuNjY5MiIgaGVpZ2h0PSI3MSIgcng9IjEwIiBmaWxsPSJ1cmwoI3BhdHRlcm4wKSIvPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9InBhdHRlcm4wIiBwYXR0ZXJuQ29udGVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgd2lkdGg9IjEiIGhlaWdodD0iMSI+Cjx1c2UgeGxpbms6aHJlZj0iI2ltYWdlMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMC4wMTg3OTcpIHNjYWxlKDAuMDA1MjA4MzMgMC4wMDU0MDQxNCkiLz4KPC9wYXR0ZXJuPgo8aW1hZ2UgaWQ9ImltYWdlMCIgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBTUFBQUFEQUNBWUFBQUJTM0d3SEFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFsVlNVUkJWSGdCN2QwL2lCMVZGTWZ4ODFZRi82UVFGS3dpa2hSYWFiWk1MRlRJR2l1Sm5ZVkNUQW9GQlFYUlVzRktGRUVMSVkxaTBNSXV3VXFNWUJvM3BhdVZGbGxEYkJRVUxEYnhIK2I1ZnZ0MnlCK3ptNTB6Yis2N1o4NzNBOCtZVlRNeGUzOTM3cmx6NzUyUmJYajRwZkh0TjYvWlMrT3hQYVNmR2pBd2s3YTlzakN5ZHovL1lIU3MrZHBJZjNuc3VmRTk0My9zcThuZjNtUEE4SjBkM1dTUGZINTBkSFk5QUFlT2pIODBHajl5T2Z2WHY3WjR3Mk9IeDRjbTk0RkRCdVJ5K3cwaiszTmhiUGFpQVFtTlJ2Ynd3cVQzMzJOQVRwTUFBSWtSQUtSR0FKQWFBVUJxQkFDcEVRQ2tSZ0NRR2dGQWFnUUFxUkVBcEVZQWtCb0JRR29FQUtrUkFLUkdBSkFhQVVCcUJBQ3BFUUNrUmdDUUdnRkFhZ1FBcVJFQXBFWUFrQm9CUUdvRUFLa1JBS1JHQUpBYUFVQnFCQUNwRVFDa1JnQ1FHZ0ZBYWdRQXFSRUFwRVlBa0JvQlFHb0VBS2tSQUtSR0FKQWFBVUJxQkFDcEVRQ2tSZ0NRR2dGQWFnUUFxUkVBcEVZQWtCb0JRR29FQUtuZGFBanIvbnZOZHU4MDI3VnordlBWbjh5V3Z6SDc1VGZyeGRYWDAzVk9mdDNmOVVvWUhUZ3lIaHRDdWV0T3M1ZWZtVGJJYS9ua3Mra242dlZLNGc0UWpIcmd0MTR4dSszV3pmK2RweDQzMnpINTUwYy90YzdVK0hXOXUrNndMYThuRVVOQURSQ0lHdU5yTDJ6ZCtCc0g5Mi9kYUxkN3ZlczEvb1pDc0ozZlYyMElRQ0JxWkcwYTlXWkRscjZ1dDIrUGhVTUFnbEJ2dkxUUGlpbDl2WGtoQUVFMDQrdzJ1c3pPbEw3ZXZCQ0FJTm9PWjlZdW1IMzNnN2w1aGs5bmZySndDRUFBU3crMkwyaFBmMk51bnV2cCtjUDVDeFlPQVFqQU14WS92V0p1cnV0MUNOdzhFWURLcVJodE94ejU1ZGRwajF6eWVpZVhMU1FDVURsUE1kcmxnWlRuZWwxcWpYa2pBSlh6RktPbGk5K295eUNFQUZUTVU0eDJXWnptdVo3Q0Zua3hIQUdvMkJQN3JiVXVZM0ZQOGF2QVJVWUFLclhyc21YSDI2VmkxRHY4eVZiOE5naEFwWjVZc3RaS0Y3L1JHNzhRZ0FxcE4vWXNMUFAyL2xvNjdTbCtvdzkvaEFCVVNJMng3ZExpTHNYdjNzV3l4WFpOQ0VDRlNnOUhTaGZiTlNFQWxWSHYzN1kzN2xMOGxpNjJhME1BS3FPNStMYTZGTCtsaSszYUVJQ0tlRGVoZEpuNkxIbTlHaEdBaW5obllyekZhT25yMVlnQVZNUlQvQjcvMHR5eXp2MWZqZ0JVd2xQODZpQ3NWZWN1ck5MRmRxMElRQ1U4eGUveGsrWld1dGl1RlFHb2dLY1kxWjdmWmVldUw0cmZTd2hBQmZZNmxqMmM3ckFIbCtMM0VvNUdMRWpMRzNiYzh2K3ZlZWJpMVJ0N0Q3N3lGTDg2OGVIcTYra3VwRkJFM0F6ZjRIRGNEbFJFM24vZnRGSHJhYW9hczRZWE96WWFlc1NqQWowVWpoTW5ZODRRY1Fkb1FUMWc4OW05TTA4RHZ4NzlXYng4ZVBybmNhTER0T3c4RUlBdDZCdTZiM0U2Um4vZ1hocjg5V2hvUlFBR1FEMjh2cG4wOHUxbzZLZGhZYVJpbVFCc1dDOUc5MDgvTlBvODBnZUFoajliYTM5WUtHa0RRTU9mUFMyVmlEWWxtaklBR3VOcjFxTHJHMVJ3cFloTEpWSUZRRDM5MDQ5UFh4K0UyZEl6QUo0RFZFd3pPbnEvRnIzK2JHbklveVhadkNXeVlocm5SMzJKVzQwMHpibDZicm9jNDR2bDJFc2hCaDhBTlh6UDJwZnRVbVA0N3Z2cGordWZYNmNmMFl6STFZMURiMTFzdTRibm5RLzl3NHZTMTR0bTBBSG9vL0dya2V2c2ZhM0cxQnFZTnIxZjZlTUhzeDUzMk1aZ0F6REx4cTlHcmx1OUduMlhOZkdsdHlCbU8rdmZZNUFCbUZYamJ3bzhmYnFPYytkeC9HQzJzLzQ5QmhlQXB1RHRZcFlOdjFINitNR01aLzE3RENvQUd2TSsrNlIxb2thZ0luRFdEWUd6L3VzMG1BQ284V3ZHb3d2ZC92c1lBbkRXZjcwR0V3QU5lN3dQdVRUTU9mcHBmdzJBcy83ck5ZZ0E2Q212NTVZdmF2eXZ2dDNmVzg1TG44Q2dZdHZ6Ym9HTXd4OFp4S2tRV3VMZzBYZmpsOUluTUtqWUx2bHVnZWpDQjhBejI5SFFzS2ZQeGk4UjV2NnpEbjhrZkFDOFU1NGFZL2Y5alM5OS9DREhIYllYdWdiWXQranIvZlZOTC9IQXAvVHhnNTdyblY3WjNqQnRDR2NBWFV2b0FPeDNGcjRhOS9kdEhzY1BldW9ON1kxb3N6K2lyK2NrOHhKMkNMVCtKc1ZGYTYxVXdWZTYrRzFPWk9pYi9yL2VmMzA0K3lyQ0JzQjdMR0NwdFM2bHovcHYrNkN0QzRXdHp5WG1KWVVOd0Y3blhIZXAzci9rV2YvejRPMkFhaE0yQUx2dnR0WktUZmQ1OWh4M09ldGZzczdqZHhVeUFKN3hybVl4U2t6M2VXcVRXYXpES1gwa3lmbGc1LzlzSm1RQVBPUGRVc09MZVc1Q09WN3dYTTR6NTJ3UVFnWkF2V3hiWndvRXdMTUtVMlpWbU90ZzJsSkRvYUZzbklrWkFNY1VYSW5oZ2ViOTU3a0paVzFqYlZQZklWRGo1emtBcnJEKzRNdnhKSGJXcXpCVkN5Z0VmUlQ4NmtUMEVHeEkyeVpEUGduMkRJSDY1dG1QME5jbUZQMjZUVVBWMG1pdEVOWEVRZHZhU1ExZVI3dm8yQmZWVU5IUEFMcVdrQUh3ZkJQNmZITHBYZmJROTdTc2d0RHNiY2ExaFJ3Q3JUa0M0SGx1c0YzZXJaaFpONkhVSkdRQVBIZUFYVDI5N2NXN0ZUUHpKcFNhaEF5QXQrRjRUbWJZaXJaaWR0bVBnUGtMR1FEdm5QN0JHYjRNUStOKzcxWk1ldjk2eEx3RE9CLzdheWJrOWVldHMrWUlscG8zNDJCN3dqNEhXRjR4bCtZTmtGNGE5bmdidnd6cElkSVFoQTFBbHhrVUJlQzVKOXNQaC9UZmRka01rdlh3cVpxRjNSSzV1bkUwdVhkTXIzcEFld3F1dHpsZXYvNmprem4rZzB2ZG55V1UySXFKZGtZSGpvekhGdFFzVDRIKzlvY3JWNHlxNFd1NE02dVhaZmQxN0NLNkNSMEFGYlhIM3F6LzFVZGE4RWJ2WDZmUWkrSDBSUGpqeW52VlpsME82aFIrTmFqV3dOZDZzTlA1UXN1VDRUZUk1ZEJ2dkY5Zkk2UHh4ekNJQURRYlFXcFpxbHZpMEYzTXhtQTJ4RFFiUWViZDR6YS9EeHAvRElQYUVhWkdOODhRTkxNOU5QNDRRaytEYmtacmRmUjh3UHZTakxiT2I4eEduV0RqU1RpRERFQkRlM1M3dkRwcE80WjJXR3cyZ3c1QW80OGdxT0hyeVc3bXMvV0hJRVVBR2xvSnFqQjR6dTdVTUVkamU3MHRmb2lidzdNYTVKdmlONlBldXVteFZTZnMzbmxwcStTT1d5NmROcUdablBVZmY1dCtWcytaL1R6QWwwTWcyUjBBdUJvSFl5RTFBb0RVQ0FCU0l3QklqUUFnTlFLQTFBZ0FVaU1BU0kwQUlEVUNnTlFJQUZJakFFaU5BQ0ExQW9EVUNBQlNJd0JJalFBZ05RS0ExQWdBVWlNQVNJMEFJRFVDZ05RSUFGSWpBRWlOQUNBMUFvRFVDQUJTSXdCSWpRQWdOUUtBMUFnQVVpTUFTSTBBSURVQ2dOUUlBRklqQUVpTkFDQTFBb0RVQ0FCU0l3QklqUUFnTlFLQTFBZ0FVaU1BU0UwQk9HVkFRdU94clN4TS9uTEtnSXhHOXU3Q3JSZnRQUnZiV1FNeW1iVDVMejRZSFZzNDhkSG85OUZGZTRRUUlJMUpXMTl2ODZhYndHV1dEbzhQVFlxQ0Z5ZGYzV1BBOEp6U2tQL3Z5YWpuMUtUajF4ZitBMDgvQW05ekN0UUFBQUFBQUVsRlRrU3VRbUNDIi8+CjwvZGVmcz4KPC9zdmc+Cg=='
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
            })
        )
}
web.enable(SupportedThemes.auto);
//     }).splitView({
//         right: [
//             web.elements.none().note({
//                 text: "Splited Views",
//                 type: "fire"
//             })
//         ],
//         maxWidth: "35rem",
//         theme: "modern",
//         left: [
//             web.elements.none().cards({
//                 style: "small",
//                 columns: "1",
//                 hidden: false,
//                 cards: [
//                     {
//                         subtitle: "was",
//                         title: "test"
//                     }
//                 ]
//             })
//         ]
//     })
// };
// document.addEventListener("DOMContentLoaded", () => web.enable(SupportedThemes.auto));