import { createElement } from "../Components";
import { Custom } from "../generic/Custom";
import { Input } from "../generic/Input";
import { PlainText } from "../generic/PlainText";
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
    let emailField = Input({
        type: "email",
        placeholder: email?.text ?? "Email",
        value: email?.default
    }).draw();
    let passwordFiled = Input({
        type: "password",
        placeholder: password?.text ?? 'Passwords',
        value: password?.default
    }).draw();
    let urlField = Input({
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
        buttonListLeftArea: content,
        buttons: [
            {
                title: button || "Login",
                action: submitAction
            }
        ]
    });
}