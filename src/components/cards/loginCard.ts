import { createElement } from "../Components.ts";
import { Custom } from "../generic/Custom.ts";
import { Input } from "../generic/Input.ts";
import { PlainText } from "../generic/PlainText.ts";
import { richCard } from "./richCard.ts";

export const loginCard = ({ titleText, email, url, button, password, makeLogin, errorMessage }: {
    titleText?: string
    email?: { text: string, default?: string },
    url?: { text: string, default?: string },
    button?: string,
    password?: { text: string, default?: string },
    errorMessage?: string,
    makeLogin: (loginData: { password: string, email?: string, url?: string }) => Promise<boolean>
}) => {
    const form = createElement("form") as HTMLFormElement;
    form.style.display = "grid";
    form.style.gap = "1rem";
    const emailField = Input({
        type: "email",
        placeholder: email?.text ?? "Email",
        value: email?.default
    }).draw();
    const passwordFiled = Input({
        type: "password",
        placeholder: password?.text ?? 'Passwords',
        value: password?.default
    }).draw();
    const urlField = Input({
        type: "url",
        placeholder: url?.text ?? 'Location',
        value: url?.default
    }).draw();

    if (url) form.append(urlField);
    if (email) form.append(emailField);
    if (password) form.append(passwordFiled);

    const submitAction = async () => {
        const response = await makeLogin({
            password: passwordFiled.querySelector('input')!.value,
            email: emailField.querySelector('input')?.value || undefined,
            url: urlField.querySelector('input')?.value || undefined
        })
        if (!response) {
            content.innerText = errorMessage ?? 'wrong credentials';
        }
    };
    if (password)
        passwordFiled.querySelector('input')!.onkeyup = (e) => {
            if (e.key == "Enter")
                submitAction();
        }
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
}