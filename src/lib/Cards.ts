export interface DefaultCard
{
    width?: number;
    height?: number;
    type: "default"
    small: boolean;
    title: HTMLElement | string;
    subtitle?: HTMLElement | string;
}
export interface ModernCard
{
    width?: number;
    height?: number;
    type: "modern";
    title: HTMLElement | string;
    subtitle?: string;
    icon?: string;
    description?: HTMLElement | string;
    align: "right" | "left";
}
export type ButtonActions = {
    text: HTMLElement | string;
    action: () => void;
}
export interface NoteCard
{
    width?: number;
    height?: number;
    type: "note";
    icon: string;
    title: HTMLElement | string;
}
export interface RichCard
{
    width?: number;
    height?: number;
    type: "rich";
    title: HTMLElement | string;
    content: (HTMLElement | string)[] | (HTMLElement | string);
    buttons?: (ButtonActions & { color: "red" | "normal" })[];
}
export const defaultCard = (options: { title: HTMLElement | string, subtitle?: string, small?: boolean, width?: number, height?: number; }): DefaultCard =>
    ({
        type: "default",
        title: options.title,
        small: options.small ?? false,
        subtitle: options.subtitle,
        width: options.width,
        height: options.height
    })
export const modernCard = (options: { title: HTMLElement | string, subtitle?: string, description?: HTMLElement | string, align?: "right" | "left", icon?: string, width?: number, height?: number; }): ModernCard =>
    ({
        type: "modern",
        title: options.title,
        align: options.align ?? 'left',
        description: options.description,
        subtitle: options.subtitle,
        icon: options.icon,
        width: options.width,
        height: options.height ? options.height + 1 : undefined
    })
export const noteCard = (options: { title: HTMLElement | string, icon: "✔️" | "🏡" | "🔥" | "❌" | "⚠️" | "👨‍💻", width?: number, height?: number }): NoteCard =>
    ({
        type: "note",
        icon: options.icon,
        title: options.title,
        width: options.width,
        height: options.height
    })
export const richCard = (options: { title: HTMLElement | string, content: (HTMLElement | string)[] | (HTMLElement | string), buttons?: (ButtonActions & { color: "red" | "normal" })[], width?: number, height?: number }): RichCard =>
    ({
        type: "rich",
        title: options.title,
        content: options.content,
        buttons: options.buttons,
        height: options.height ? options.height + 1 : undefined,
        width: options.width
    })

export const loginCard = ({ titleText, email, url, button, password, makeLogin, errorMessage }: {
    titleText?: string
    email?: { text: string, default?: string },
    url?: { text: string, default?: string },
    button?: string,
    password?: { text: string, default?: string },
    errorMessage?: string,
    makeLogin: (loginData: { password: string, email?: string, url?: string }) => Promise<boolean>
}) =>
{
    let form = document.createElement("form");
    let emailField: HTMLInputElement = document.createElement("input");
    let passwordFiled: HTMLInputElement = document.createElement("input");
    let urlField: HTMLInputElement = document.createElement("input");
    if (url)
    {
        urlField.type = "url";
        urlField.classList.add('default');
        urlField.placeholder = url.text;
        if (url.default)
            urlField.value = url.default;
        form.append(urlField);
    }
    if (email)
    {
        emailField.type = "email";
        emailField.placeholder = email.text;
        emailField.classList.add('default');
        if (email.default)
            emailField.value = email.default;
        form.append(emailField);
    }
    if (password)
    {
        passwordFiled.type = "password";
        passwordFiled.placeholder = password.text;
        passwordFiled.classList.add('default');
        if (password.default)
            passwordFiled.value = password.default;

        form.append(passwordFiled);
    }
    let buttonInput = document.createElement("input");
    buttonInput.type = "button";
    buttonInput.value = button || "Login";
    if (password)
        passwordFiled.onkeyup = (e) =>
        {
            if (e.key == "Enter")
                buttonInput.click();
        }
    const loader = document.createElement("div");
    loader.classList.add('loader');
    const content = document.createElement("span");
    content.classList.add('content');
    content.innerHTML = errorMessage || 'wrong credentials';
    loader.append(buttonInput);
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 73 73")
    icon.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    icon.setAttribute("fill", "none");
    icon.innerHTML = `<circle cx="36.5" cy="36.5" r="35.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    loader.append(icon);
    form.append(loader, content);
    buttonInput.onclick = () =>
    {
        if (loader.classList.contains('loading'))
            return;
        loader.classList.add('loading')
        makeLogin({
            password: passwordFiled.value,
            email: emailField.value || undefined,
            url: urlField.value || undefined
        }).then((response) =>
        {
            if (!response)
            {
                loader.classList.remove('loading');
                content.classList.add('failed');
            }
        })
    }

    return richCard({
        title: titleText || "Login",
        content: form
    });
}

export const checkIfModernCard = (card: any): card is ModernCard => card.type === "modern";
export const checkIfDefaultCard = (card: any): card is DefaultCard => card.type === "default";
export const checkIfRichCard = (card: any): card is RichCard => card.type === "rich";
export const checkIfNoteCard = (card: any): card is NoteCard => card.type === "note";
