export const blur = `
    :root {
        --background-color: hsla(0, 0%, 4%, 1);
        --on-background-text: white;
        --background-card: hsl(0deg 0% 8% / 68%);
        --on-card-text: #ffffff;
        --on-card-subtext: #646464;
        --on-card-background: rgb(51 51 51);
        --text-red: #f81919;
    }
    body {
        background: url(%base64Image%) no-repeat center center fixed;
        background-size: cover;
        background-attachment: fixed;
    }
    card, center > button {
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
    }
    .dialog-backdrop.open .dialog {
        backdrop-filter: blur(1rem);
    }
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 50px black inset !important;
        -webkit-text-fill-color: var(--on-card-text) !important;
    }
    card.modern .subtitle {
        color: #adadad;
    }
`;
export const dark = `
    :root {
        --box-shadow: none;
        --background-color: hsla(0, 0%, 4%, 1);
        --on-background-text: #ececec;
        --background-card: hsla(0, 0%, 9%, 1);
        --on-card-text: #ffffff;
        --on-card-subtext: #646464;
        --on-card-background: hsl(0deg 0% 14%);
        --text-red: #f81919;
    }
`;

export const white = `
    :root {
        --box-shadow: 0px 4px 8px 0px rgb(0 0 0 / 15%);
        --background-color: hsla(0, 0%, 90%, 1);
        --on-background-text: black;
        --background-card: hsla(0, 0%, 100%, 1);
        --on-card-text: #2d2d2d;
        --on-card-subtext: #646464;
        --on-card-background: rgb(255, 255, 255);
        --text-red: #f81919;
    }
`;