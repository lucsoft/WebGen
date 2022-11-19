import { createElement } from "../Components.ts";
import { Custom } from "../generic/Custom.ts";
import { TextInput } from "../generic/FormText.ts";
import { PlainText } from "../generic/PlainText.ts";
import { richCard } from "./richCard.ts";

export const loginCard = ({ titleText, email, url, button, password, makeLogin, errorMessage }: {
    titleText?: string;
    email?: { text: string, default?: string; },
    url?: { text: string, default?: string; },
    button?: string,
    password?: { text: string, default?: string; },
    errorMessage?: string,
    makeLogin: (loginData: { password: string, email?: string, url?: string; }) => Promise<boolean>;
}) => {
    const form = createElement("form") as HTMLFormElement;
    form.style.display = "grid";
    form.style.gap = "1rem";
    const emailField = TextInput("email", email?.text ?? "Email");
    const passwordField = TextInput("password", password?.text ?? "Email");
    const urlField = TextInput("url", url?.text ?? "Email");

    if (email?.default) emailField.setValue(email?.default);
    if (password?.default) passwordField.setValue(password?.default);
    if (url?.default) urlField.setValue(url?.default);

    if (url) form.append(urlField.draw());
    if (email) form.append(emailField.draw());
    if (password) form.append(passwordField.draw());

    const submitAction = async () => {
        const response = await makeLogin({
            password: form.querySelector<HTMLInputElement>('input[type="password"]')?.value || "",
            email: form.querySelector<HTMLInputElement>('input[type="email"]')?.value || undefined,
            url: form.querySelector<HTMLInputElement>('input[type="url"]')?.value || undefined
        });
        if (!response) {
            content.innerText = errorMessage ?? 'wrong credentials';
        }
    };
    if (password)
        form.querySelector<HTMLInputElement>('input[type="password"]')!.onkeyup = (e) => {
            if (e.key == "Enter")
                submitAction();
        };
    const content = PlainText('').draw();
    content.style.alignSelf = "center";

    form.append(content);

    return richCard({
        title: titleText || "Login",
        content: Custom(form),
        buttonListLeftArea: Custom(content),
        buttons: [
            {
                title: button || "Login",
                action: submitAction
            }
        ]
    });
};