export const blur = `
 /*   :root {
        --default-background-color: rgba(0, 0, 0, 0.575);
        --default-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.45);
        --default-card-radius:4px;
        --default-card-margin: 0.6rem 0;
        --default-card-padding: 1.5rem;
        --default-card-color: white;
        --default-backdrop: blur(1.5rem);
    }*/
    :root {
        --default-background-color: rgb(24, 24, 24);
        --default-shadow: unset;
        --background-color: hsla(0, 0%, 4%, 1);
        --on-background-text: #313131;
        --background-card: hsla(0, 0%, 0%, 0.67);
        --on-card-text: #ffffff;
        --on-card-subtext: #646464;
        --on-card-background: rgba(0, 0, 0, 0.6);
        --text-red: #f81919;
    }
    body {
        background: url(%base64Image%) no-repeat center center fixed;
        background-size: cover;
        background-attachment: fixed;
    }
    card, center > button {
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
        --default-background-color: rgb(16, 16, 16);
        --default-shadow: unset;
        --background-color: hsla(0, 0%, 4%, 1);
        --on-background-text: #313131;
        --background-card: hsla(0, 0%, 9%, 1);
        --on-card-text: #ffffff;
        --on-card-subtext: #646464;
        --on-card-background: hsl(0deg 0% 14%);
        --text-red: #f81919;
    }
`;

export const white = `
    :root {
        --default-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.45);
        --default-background-color: rgb(255, 255, 255);
        --background-color: hsla(0, 0%, 90%, 1);
        --on-background-text: white;
        --background-card: hsla(0, 0%, 100%, 1);
        --on-card-text: #2d2d2d;
        --on-card-subtext: #646464;
        --on-card-background: rgb(255, 255, 255);
        --text-red: #f81919;
    }
    .titlew, h2 {
        text-shadow: 0 0 18px rgb(0 0 0 / 61%);
    }
`;