export const blur: { [ key in string ]: string } = {
    [ "--background-color" ]: "hsla(0, 0%, 4%, 1)",
    [ "--on-background-text" ]: "white",
    [ "--background-card" ]: "hsl(0deg 0% 8% / 68%)",
    [ "--on-card-text" ]: "#ffffff",
    [ "--on-card-subtext" ]: "#646464",
    [ "--on-card-background" ]: "rgb(41 41 41)",
    [ "--text-red" ]: "#f81919",
    [ "--backdrop-filter" ]: "blur(1rem)"
}

export const dark: { [ key in string ]: string } = {
    [ "--box-shadow" ]: "none",
    [ "--background-color" ]: "hsla(0, 0%, 4%, 1)",
    [ "--on-background-text" ]: "#ececec",
    [ "--background-card" ]: "hsla(0, 0%, 9%, 1)",
    [ "--on-card-text" ]: "#ffffff",
    [ "--on-card-subtext" ]: "#646464",
    [ "--on-card-background" ]: "hsl(0deg 0% 14%)",
    [ "--text-red" ]: "#f81919",
};

export const white: { [ key in string ]: string } = {
    [ "--box-shadow" ]: " 0px 4px 8px 0px rgb(0 0 0 / 15%)",
    [ "--background-color" ]: " hsla(0, 0%, 90%, 1)",
    [ "--on-background-text" ]: " black",
    [ "--background-card" ]: " hsla(0, 0%, 100%, 1)",
    [ "--on-card-text" ]: "#2d2d2d",
    [ "--on-card-subtext" ]: "#646464",
    [ "--on-card-background" ]: " rgb(255, 255, 255)",
    [ "--text-red" ]: "#f81919",
}