import { Button, ButtonStyle, Grid, Checkbox, Color, defaultCard, Dialog, Horizontal, Input, list, loginCard, modernCard, noteCard, PageTitle, richCard, searchCard, SearchMode, span, SupportedThemes, Tab, Title, Vertical, View, WebGen, BootstrapIcons, CommonIconType, CommonIcon, Icon, IconButton } from "../src/webgen";

const web = WebGen({
    icon: new BootstrapIcons(),
    events: {
        themeChanged: (newTheme, opt) => {
            if (newTheme == SupportedThemes.blur)
                opt.setImage('https://picsum.photos/1920/1080');
            else if (newTheme != SupportedThemes.auto)
                opt.clearImage();
        }
    }
});

const svg = `<svg width='74' height='70' viewBox='0 0 74 70' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='0.864655' width='72.6316' height='70' rx='12.8947' fill='url(#paint0_linear)'/><path d='M50.8891 51.6549C50.8891 52.1781 50.465 52.6021 49.9419 52.6021L45.6676 52.6021L24.4235 52.6021C23.9004 52.6021 23.4763 52.1781 23.4763 51.6549L23.4763 18.3329C23.4763 17.8098 23.9004 17.3857 24.4235 17.3857L45.3141 17.3857C45.5421 17.3857 45.7625 17.4679 45.9347 17.6173L50.5625 21.6302C50.7699 21.8102 50.8891 22.0713 50.8891 22.3459L50.8891 51.6549ZM29.645 21.9135C29.1219 21.9135 28.6978 22.3376 28.6978 22.8607L28.6978 47.1271C28.6978 47.6502 29.1219 48.0743 29.645 48.0743L44.7204 48.0743C45.2435 48.0743 45.6676 47.6502 45.6676 47.1271L45.6676 22.8607C45.6676 22.3376 45.2435 21.9135 44.7204 21.9135L29.645 21.9135Z' fill='white'/><path d='M53.2946 49.5207C53.3748 50.0377 53.0201 50.5172 52.5023 50.5918L48.2757 51.2004L27.2657 54.2258C26.7479 54.3003 26.2631 53.9417 26.183 53.4247L21.0708 20.4672C20.9907 19.9502 21.3454 19.4707 21.8632 19.3961L42.5229 16.4212C42.7488 16.3887 42.9798 16.4387 43.1733 16.562L48.3658 19.8718C48.5984 20.0201 48.7561 20.2609 48.7982 20.532L53.2946 49.5207ZM27.722 23.1306C27.2042 23.2052 26.8494 23.6847 26.9296 24.2016L30.6525 48.203C30.7327 48.72 31.2174 49.0786 31.7352 49.004L46.6435 46.8573C47.1613 46.7827 47.5161 46.3032 47.4359 45.7863L43.713 21.7849C43.6328 21.2679 43.1481 20.9093 42.6303 20.9839L27.722 23.1306Z' fill='white' fill-opacity='0.35'/><path d='M55.3237 47.0604C55.4816 47.5591 55.2029 48.0834 54.7012 48.2315L50.6172 49.4369L30.3076 55.4314C29.8059 55.5795 29.2711 55.2952 29.1131 54.7965L19.018 22.9192C18.8601 22.4205 19.1388 21.8961 19.6405 21.748L39.6094 15.8541C39.8291 15.7893 40.0663 15.8058 40.2773 15.9005L45.9175 18.4327C46.1695 18.5458 46.3615 18.7604 46.4441 19.0212L55.3237 47.0604ZM26.0045 24.6052C25.5027 24.7533 25.224 25.2776 25.382 25.7764L32.7341 48.9922C32.8921 49.491 33.4269 49.7752 33.9286 49.6271L48.3372 45.3744C48.839 45.2263 49.1177 44.7019 48.9597 44.2032L41.6076 20.9873C41.4496 20.4886 40.9148 20.2044 40.4131 20.3525L26.0045 24.6052Z' fill='white' fill-opacity='0.07'/><defs><linearGradient id='paint0_linear' x1='37.1804' y1='0' x2='37.1804' y2='70' gradientUnits='userSpaceOnUse'><stop stop-color='#5DB5F5'/><stop offset='1' stop-color='#06539A'/></linearGradient></defs></svg>`;
type ViewOptions = {
    stateID: number;
    showDialog: boolean;
    switchDisable: boolean;
    switchChecked: boolean;
};

const themeNaming = [ "light", "gray", "dark", "blur", "auto", "auto (dark)", "auto (light)" ];
const themeArray = [ SupportedThemes.light, SupportedThemes.gray, SupportedThemes.dark, SupportedThemes.blur, SupportedThemes.auto, SupportedThemes.autoDark, SupportedThemes.autoLight ]

const themeArrayWithActions = themeArray.map((x, i): [ displayName: string, action: () => void ] => [ themeNaming[ i ], () => web.theme.updateTheme(x) ]);

const dialog = (globalThis as any).dialog = Dialog(({ use }) => { use(span("This is a nice test")) })
    .allowUserClose()
    .addButton("Direct", 'close')
    .addButton("Fuction", () => 'close', Color.Critical, ButtonStyle.Secondary)
    .addButton("Promise", () => new Promise(done => setTimeout(() => done('close'), 2000)), Color.Colored, ButtonStyle.Secondary)
    .setTitle("Hello World!");

(globalThis as any).test = Dialog(({ use }) => { use(span("This is a nice test")) })
    .allowUserClose()
    .addButton("Direct", 'close')
    .addButton("Fuction", () => 'close', Color.Critical, ButtonStyle.Secondary)
    .addButton("Promise", () => new Promise(done => setTimeout(() => done('close'), 2000)), Color.Colored, ButtonStyle.Secondary)
    .setTitle("Hello World!")
    .open();

View<ViewOptions>(({ use: draw, state, update }) => {

    if (state.showDialog === true) {
        dialog
            .onClose(() => update({ showDialog: false }))
            .open()
    }
    draw(Horizontal({
        gap: "0.5rem",
        align: 'center'
    },
        Tab({
            color: Color.Colored,
            selectedIndex: state.showDialog ? 3 : (state.stateID !== undefined ? state.stateID - 1 : undefined)
        },
            [ "Show Titles", () => update({ stateID: 1 }) ],
            [ "Show Buttons", () => update({ stateID: 2 }) ],
            [ "Show Cards", () => update({ stateID: 3 }) ],
            [ "Show Dialog", () => update({ showDialog: true }) ],
        )
    ));

    if (state.stateID === 1) {
        draw(Title({
            type: "big",
            title: "Big Title"
        }));
        draw(Title({
            type: "small",
            title: "Title"
        }));
        draw(Title({
            type: "small",
            title: "Title",
            subtitle: "Subtitle"
        }))
    }

    if (state.stateID === 2) {
        const color = [ Color.Disabled, Color.Grayscaled, Color.Colored, Color.Critical ];
        const state = [ ButtonStyle.Inline, ButtonStyle.Secondary, ButtonStyle.Normal, ButtonStyle.Progress, ButtonStyle.Spinner ];
        draw(Horizontal({ align: 'center', gap: "19px" },
            ...color.map(color => Vertical({ gap: "19px" }, ...state.map((state, index) => Button({
                color: color,
                state,
                pressOn: ({ setProgress }) => {
                    if (state === ButtonStyle.Progress)
                        setProgress(Math.random() * (100 - 0))
                },
                progress: 25,
                text: 'action'
            })), Checkbox({
                color
            }), IconButton({
                color,
                icon: CommonIconType.Edit
            })))
        ))

    }

    if (state.stateID === 3) {
        draw(PageTitle("Hello World!"));
        draw(Grid({ minColumnWidth: 14 },
            defaultCard({ title: "supr", small: true }),
            defaultCard({ title: "supr", subtitle: "supr" }),
            modernCard({
                title: "Some Text",
                subtitle: "Some other Text",
                icon: `data:image/svg+xml,%3Csvg width='74' height='70' viewBox='0 0 74 70' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0.864655' width='72.6316' height='70' rx='12.8947' fill='url(%23paint0_linear)'/%3E%3Cpath d='M50.8891 51.6549C50.8891 52.1781 50.465 52.6021 49.9419 52.6021L45.6676 52.6021L24.4235 52.6021C23.9004 52.6021 23.4763 52.1781 23.4763 51.6549L23.4763 18.3329C23.4763 17.8098 23.9004 17.3857 24.4235 17.3857L45.3141 17.3857C45.5421 17.3857 45.7625 17.4679 45.9347 17.6173L50.5625 21.6302C50.7699 21.8102 50.8891 22.0713 50.8891 22.3459L50.8891 51.6549ZM29.645 21.9135C29.1219 21.9135 28.6978 22.3376 28.6978 22.8607L28.6978 47.1271C28.6978 47.6502 29.1219 48.0743 29.645 48.0743L44.7204 48.0743C45.2435 48.0743 45.6676 47.6502 45.6676 47.1271L45.6676 22.8607C45.6676 22.3376 45.2435 21.9135 44.7204 21.9135L29.645 21.9135Z' fill='white'/%3E%3Cpath d='M53.2946 49.5207C53.3748 50.0377 53.0201 50.5172 52.5023 50.5918L48.2757 51.2004L27.2657 54.2258C26.7479 54.3003 26.2631 53.9417 26.183 53.4247L21.0708 20.4672C20.9907 19.9502 21.3454 19.4707 21.8632 19.3961L42.5229 16.4212C42.7488 16.3887 42.9798 16.4387 43.1733 16.562L48.3658 19.8718C48.5984 20.0201 48.7561 20.2609 48.7982 20.532L53.2946 49.5207ZM27.722 23.1306C27.2042 23.2052 26.8494 23.6847 26.9296 24.2016L30.6525 48.203C30.7327 48.72 31.2174 49.0786 31.7352 49.004L46.6435 46.8573C47.1613 46.7827 47.5161 46.3032 47.4359 45.7863L43.713 21.7849C43.6328 21.2679 43.1481 20.9093 42.6303 20.9839L27.722 23.1306Z' fill='white' fill-opacity='0.35'/%3E%3Cpath d='M55.3237 47.0604C55.4816 47.5591 55.2029 48.0834 54.7012 48.2315L50.6172 49.4369L30.3076 55.4314C29.8059 55.5795 29.2711 55.2952 29.1131 54.7965L19.018 22.9192C18.8601 22.4205 19.1388 21.8961 19.6405 21.748L39.6094 15.8541C39.8291 15.7893 40.0663 15.8058 40.2773 15.9005L45.9175 18.4327C46.1695 18.5458 46.3615 18.7604 46.4441 19.0212L55.3237 47.0604ZM26.0045 24.6052C25.5027 24.7533 25.224 25.2776 25.382 25.7764L32.7341 48.9922C32.8921 49.491 33.4269 49.7752 33.9286 49.6271L48.3372 45.3744C48.839 45.2263 49.1177 44.7019 48.9597 44.2032L41.6076 20.9873C41.4496 20.4886 40.9148 20.2044 40.4131 20.3525L26.0045 24.6052Z' fill='white' fill-opacity='0.07'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='37.1804' y1='0' x2='37.1804' y2='70' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235DB5F5'/%3E%3Cstop offset='1' stop-color='%2306539A'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E`,
                description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et"
            }),
            modernCard({
                title: "Some Text",
                align: "left",
                subtitle: "Some other Text",
                icon: `data:image/svg+xml,%3Csvg width='74' height='70' viewBox='0 0 74 70' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0.864655' width='72.6316' height='70' rx='12.8947' fill='url(%23paint0_linear)'/%3E%3Cpath d='M50.8891 51.6549C50.8891 52.1781 50.465 52.6021 49.9419 52.6021L45.6676 52.6021L24.4235 52.6021C23.9004 52.6021 23.4763 52.1781 23.4763 51.6549L23.4763 18.3329C23.4763 17.8098 23.9004 17.3857 24.4235 17.3857L45.3141 17.3857C45.5421 17.3857 45.7625 17.4679 45.9347 17.6173L50.5625 21.6302C50.7699 21.8102 50.8891 22.0713 50.8891 22.3459L50.8891 51.6549ZM29.645 21.9135C29.1219 21.9135 28.6978 22.3376 28.6978 22.8607L28.6978 47.1271C28.6978 47.6502 29.1219 48.0743 29.645 48.0743L44.7204 48.0743C45.2435 48.0743 45.6676 47.6502 45.6676 47.1271L45.6676 22.8607C45.6676 22.3376 45.2435 21.9135 44.7204 21.9135L29.645 21.9135Z' fill='white'/%3E%3Cpath d='M53.2946 49.5207C53.3748 50.0377 53.0201 50.5172 52.5023 50.5918L48.2757 51.2004L27.2657 54.2258C26.7479 54.3003 26.2631 53.9417 26.183 53.4247L21.0708 20.4672C20.9907 19.9502 21.3454 19.4707 21.8632 19.3961L42.5229 16.4212C42.7488 16.3887 42.9798 16.4387 43.1733 16.562L48.3658 19.8718C48.5984 20.0201 48.7561 20.2609 48.7982 20.532L53.2946 49.5207ZM27.722 23.1306C27.2042 23.2052 26.8494 23.6847 26.9296 24.2016L30.6525 48.203C30.7327 48.72 31.2174 49.0786 31.7352 49.004L46.6435 46.8573C47.1613 46.7827 47.5161 46.3032 47.4359 45.7863L43.713 21.7849C43.6328 21.2679 43.1481 20.9093 42.6303 20.9839L27.722 23.1306Z' fill='white' fill-opacity='0.35'/%3E%3Cpath d='M55.3237 47.0604C55.4816 47.5591 55.2029 48.0834 54.7012 48.2315L50.6172 49.4369L30.3076 55.4314C29.8059 55.5795 29.2711 55.2952 29.1131 54.7965L19.018 22.9192C18.8601 22.4205 19.1388 21.8961 19.6405 21.748L39.6094 15.8541C39.8291 15.7893 40.0663 15.8058 40.2773 15.9005L45.9175 18.4327C46.1695 18.5458 46.3615 18.7604 46.4441 19.0212L55.3237 47.0604ZM26.0045 24.6052C25.5027 24.7533 25.224 25.2776 25.382 25.7764L32.7341 48.9922C32.8921 49.491 33.4269 49.7752 33.9286 49.6271L48.3372 45.3744C48.839 45.2263 49.1177 44.7019 48.9597 44.2032L41.6076 20.9873C41.4496 20.4886 40.9148 20.2044 40.4131 20.3525L26.0045 24.6052Z' fill='white' fill-opacity='0.07'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='37.1804' y1='0' x2='37.1804' y2='70' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%235DB5F5'/%3E%3Cstop offset='1' stop-color='%2306539A'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E`,
                description: "Lorem ipsum dolor sit amet"
            }),
            modernCard({
                title: "Some Text",
                subtitle: "Some other Text",
                align: "down",
                icon: { svg },
                description: "Nice text"
            }), richCard({
                title: "Hello World!",
                content: list({},
                    {
                        left: "Example Switch",
                        actions: [
                            {
                                type: Icon(CommonIcon(CommonIconType.Download)), click: () => update({ showDialog: true })
                            }
                        ]
                    },
                    {
                        left: Input({
                            placeholder: "Some Value"
                        }),
                        right: Button({
                            text: themeNaming[ themeArray.indexOf(web.theme.getTheme()) ],
                            dropdown: themeArrayWithActions,
                            selectedOn: () => update({})
                        })
                    },
                    {
                        left: "Example Actions",
                        right: Checkbox({
                            selected: state.switchChecked,
                            toggledOn: () => {
                                update({ switchChecked: !state.switchChecked })
                            }
                        })
                    },
                    {
                        left: "MultiStateSwitch",
                        right: Tab({
                            selectedIndex: getThemeID(),
                            selectedOn: () => update({})
                        },
                            ...themeArray.filter(x => x !== SupportedThemes.autoLight && x !== SupportedThemes.autoDark).map((x, i): [ displayName: string, action: () => void ] => [ themeNaming[ i ], () => web.theme.updateTheme(x) ])
                        )
                    },
                    {
                        left: "Update CardArray"
                    }
                ),
                buttons: [
                    {
                        title: "Okay",
                        action: () => { }
                    },
                    {
                        title: "Exit",
                        action: () => { }
                    }
                ]
            }),
            loginCard({
                email: {
                    text: "Email"
                },
                password: {
                    text: "Password"
                },
                errorMessage: 'Falsche Anmeldedaten',
                makeLogin: () => new Promise((complete) => {
                    setTimeout(() => complete(false), 5000);
                })
            }),
            noteCard({
                title: 'Hello Developers',
                icon: "👨‍💻"
            }),
            searchCard({
                width: 2,
                type: "smart",
                mode: SearchMode.ShowBegin,
                notfound: "No Entries",
                actions: {
                    close: () => {

                    },
                    remove: (entry) => {
                        console.log(entry);
                    },
                    edit: (entry) => {
                        console.log(entry);
                    },
                    download: (entry) => {
                        console.log(entry);
                    }
                },
                index: [
                    {
                        id: "2",
                        name: "was",
                        tags: [ "lol", "wow" ]
                    }
                ]
            })
        ))
    }

}).appendOn(document.body).setMaxWidth("80rem")

function getThemeID(): number {
    const indexTheme = themeArray.indexOf(web.theme.getTheme());
    if (indexTheme >= 4) return 4;
    return indexTheme;
}
