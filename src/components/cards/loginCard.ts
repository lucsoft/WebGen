import { createElement, draw, span } from "../Components";
import { Input } from "../generic/Input";
import { richCard } from "./richCard";

export const loginCard = ({ titleText, email, url, button, password, makeLogin, errorMessage }: {
    titleText?: string
    email?: { text: string, default?: string },
    url?: { text: string, default?: string },
    button?: string,
    password?: { text: string, default?: string },
    errorMessage?: string,
    makeLogin: (loginData: { password: string, email?: string, url?: string }) => Promise<boolean>
}) => {
    let form = createElement("form") as HTMLFormElement;
    form.style.display = "grid";
    form.style.gap = "1rem";
    form.style.margin = "0 -1rem";
    let emailField = draw(Input({
        type: "email",
        placeholder: email?.text ?? "Email",
        value: email?.default
    }));
    let passwordFiled = draw(Input({
        type: "password",
        placeholder: password?.text ?? 'Passwords',
        value: password?.default
    }));
    let urlField = draw(Input({
        type: "url",
        placeholder: url?.text ?? 'Location',
        value: url?.default
    }));

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
    const content = span('');
    content.style.alignSelf = "center";

    form.append(content);

    return richCard({
        title: titleText || "Login",
        content: form,
        buttonListLeftArea: content,
        buttons: [
            {
                title: button || "Login",
                action: submitAction
            }
        ]
    });
}