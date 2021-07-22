import { createElement, span } from "../Components";
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
    let emailField = createElement("input") as HTMLInputElement;
    let passwordFiled = createElement("input") as HTMLInputElement;
    let urlField = createElement("input") as HTMLInputElement;
    if (url) {
        urlField.type = "url";
        urlField.classList.add('default');
        urlField.placeholder = url.text;
        if (url.default)
            urlField.value = url.default;
        form.append(urlField);
    }
    if (email) {
        emailField.type = "email";
        emailField.placeholder = email.text;
        emailField.classList.add('default');
        if (email.default)
            emailField.value = email.default;
        form.append(emailField);
    }
    if (password) {
        passwordFiled.type = "password";
        passwordFiled.placeholder = password.text;
        passwordFiled.classList.add('default');
        if (password.default)
            passwordFiled.value = password.default;

        form.append(passwordFiled);
    }
    const submitAction = async () => {
        const response = await makeLogin({
            password: passwordFiled.value,
            email: emailField.value || undefined,
            url: urlField.value || undefined
        })
        if (!response) {
            content.innerText = errorMessage ?? 'wrong credentials';
        }

    };
    if (password)
        passwordFiled.onkeyup = (e) => {
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