export const blur = `
    :root {
        --default-background-color: rgba(0, 0, 0, 0.575);
        --default-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.45);
        --default-card-radius:4px;
        --default-card-margin: 0.6rem 0;
        --default-card-padding: 1.5rem;
        --default-card-color: white;
        --default-backdrop: blur(1.5rem);
    }
    body {
    background: url(%base64Image%) no-repeat center center fixed;
        background-size: cover;
        background-color: rgb(24, 24, 24);
        background-attachment: fixed;

    }
    card {
        background: rgba(0, 0, 0, 0.68);
        backdrop-filter: blur(1.5rem);
        -webkit-backdrop-filter: blur(1.5rem);
        color: white;
    }
    card.popup buttonlist button {
        color:white;
    }
    card.usercard .user a {
        color: white;
    }
    musicmodule musicplayer {
        background: rgb(14, 14, 14);
    }
    musicmodule musicplayer controls playbutton i {
        color: rgb(219, 219, 219);
    }
    input[type="text"].flatweb {
        background: rgb(14, 14, 14);
        color: white;
    }
    input[type="text"].flatweb::-webkit-input-placeholder {
        color: rgb(170, 170, 170);
    }
    card.popup box {
        background: rgba(0, 0, 0, 0.55);
    }
    span.titlew,h2,h4,span.subtitlew {
        text-shadow: 0 0 12px rgb(0, 0, 0);
    }
    span.subtitlew {
        font-weight: 300;
    }
    nav {
        transition: all 500ms ease !important;
    }
    nav.fixed.style_nobox {
        box-shadow: 0px 5px 14px 0px rgba(0, 0, 0, 0.69);
        background: rgba(10, 10, 10, 0.9);
    }
    nav.style_nobox ul li {

        text-shadow: 0 0 12px rgb(0, 0, 0);
        color:white;
    }
    nav.fixed.style_nobox {
        background: rgba(0, 0, 0, 0.575);
        backdrop-filter: blur(1.5rem);
        -webkit-backdrop-filter: blur(1.5rem);

    }
    nav.fixed.style_nobox ul li {
        font-size: 1.3rem;

    }
    button {
        background: rgba(0, 0, 0, 0.575);
        backdrop-filter: blur(1.5rem);
        -webkit-backdrop-filter: blur(1.5rem);
        color:white;
        overflow: hidden;
    }
    button:disabled {
        background: rgba(0, 0, 0, 0.1);
        color: rgb(143, 143, 143);
    }
    button:not(:disabled):hover {
        background: rgba(0, 0, 0, 0.34);
    }
    span.note {
        backdrop-filter: blur(1.5rem);
        -webkit-backdrop-filter: blur(1.5rem);
    }
    card.search ul {
        background: none;
    }
    card.search ul li right {
        color: white;
    }
    card.search ul li {
        border-bottom: 1px solid rgba(214, 214, 214, 0.11);
    }
    card.search ul li:hover {
        background: rgba(231, 231, 231, 0.09);
    }
    card.search input {
        background: rgba(0,0,0,0.1);
    }
    card.popup buttonlist button {
        backdrop-filter: none;
    }
    card.popup buttonlist button:hover {
        background: transparent !important;
    }
    @supports not (backdrop-filter:blur(1rem)) or (-webkit-backdrop-filter:blur(1rem)) {
        :root {
            --default-background-color: rgb(21, 21, 21);
        }
        button.one {
            background: rgba(0, 0, 0, 0.93);
        }
        card {
            background: rgba(0, 0, 0, 0.93);
        }
        .profile {
            background: rgba(0, 0, 0, 0.93);
        }
        #fixedWindow {
            background: rgba(0,0,0,0.5);
        }
        input[type="text"], input[type="password"], input[type="number"], input[type="email"], drop-down span {
            background: rgb(21, 21, 21);
        }
    }
    card.login input[type="button"] {
        background: rgba(0,0,0,0.6);
    }
    card.cardButton.active {
        background: #000000de;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
        -webkit-text-fill-color: white;
        -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.342) inset !important;
        box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.342) inset !important;
        transition: background-color 5000s ease-in-out 0s !important;
    }

    .notify span {
        background: #ffffff17;
        backdrop-filter: blur(1rem);
    }
    switch, drop-down, .tinymenu,.tiny-input {
        background: rgba(0, 0, 0, 0.57);
    }
    switch:after {
        color: #ffffff2e;
        background: #8c8c8c29;
    }
    .tinymenu button {
        color: #6f6f6f;
        background: transparent;
    }
    .tinymenu button:hover {
        background: rgb(29, 29, 29);
        color: white;
    }
`;
export const dark = `
    :root {
        --default-background-color: rgb(17, 17, 17);
        --default-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.45);
        --default-card-radius:4px;
        --default-card-margin: 0.6rem 0;
        --default-card-padding: 1.5rem;
        --default-card-color: white;
    }
    splitView.one sidebar {
        background: rgba(17, 17, 17, 1);
        color: white;
        font-size: 1.5rem;
    }

    body {
        background: rgba(0,0,0,0.97);
        color: white;
    }
    card {
        background: var(--default-background-color);
        color: white;
        box-shadow: none;
    }
    card.iconbox:not(.nohover):hover {
        background: var(--default-background-color);
    }
    card.popup buttonlist button {
        color:white;
    }
    card.usercard .user a {
        color: white;
    }
    musicmodule musicplayer {
        background: rgb(14, 14, 14);
    }
    musicmodule musicplayer controls playbutton i {
        color: rgb(219, 219, 219);
    }
    input[type="text"].flatweb,select {
        background: rgb(14, 14, 14);
        color: white;
    }
    input[type="text"].flatweb::-webkit-input-placeholder {
        color: rgb(170, 170, 170);
    }
    card.popup box {
        background: rgb(14, 14, 14);
    }
    nav.fixed.style_nobox {
        box-shadow: 0px 5px 14px 0px rgba(0, 0, 0, 0.69);
        background: rgba(10, 10, 10, 0.9);
    }
    #particles-js {
        filter: brightness(0.3);
    }
    button {
        background: var(--default-background-color);
        color: white;
    }
    button:hover,button.one, button {
        box-shadow: none;
    }
    center button:hover {
        background: var(--default-background-color);
    }
    center button:active {
        box-shadow:none;
    }
    input[type="text"], input[type="password"], input[type="number"], input[type="email"],card.login input[type="button"],switch,card.login input[type="email"], card.login input[type="password"], card.login input[type="url"], drop-down span {
        background: rgb(35, 35, 35);
        box-shadow: none;
        color: white;
    }
    @-webkit-keyframes autofill {
        to {
            background: rgba(0, 0, 0, 0.6);
            color:white;
            box-shadow: 0 -4.1rem 65px -3rem rgba(0, 0, 0, 0.25) inset;
        }
    }

    input[type="text"]:-webkit-autofill, input[type="password"]:-webkit-autofill, input[type="email"]:-webkit-autofill {
        -webkit-animation-name: autofill !important;
        -webkit-animation-fill-mode: both !important;
    }
    card.search ul {
        background: rgb(15, 15, 15) !important;
    }
    card.search ul li {
        background: rgb(15, 15, 15) !important;
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    card.search ul li:hover {
        background: rgba(0, 0, 0, 0.9);

    }
    card.search ul li right {
        color: rgb(156, 156, 156);
    }
    card.cardButton.active {
        background: #232323;
    }
    card.modern span.subtitle {
        color: #717171;
    }

    .tiny-input,.tinymenu, .tinymenu button {
        background: #232323;
        color: #6f6f6f;
    }
    .tinymenu button:hover {
        background: rgb(29, 29, 29);
        color: white;
    }
    card.cardButton .value {
        color: #ffffff8f;
    }
`;

export const white = `
    :root {
        --default-shadow: 0px 6px 11px 0px rgba(0, 0, 0, 0.15);;
        --default-secondary-color: #474747;
        --default-background-color: rgb(251, 248, 248);
    }
    span.tag {
        background: rgba(107, 107, 107, 0.11);
        color: #616161;
    }
    span.tag.category {
        color: #2f2f2f;
        background: rgba(177, 177, 177, 0.41);
    }
    body {
        background: linear-gradient(180deg, #F8F7F7 0%, #DCDCDC 100%);
        color: black;
        overscroll-behavior: none;
    }
    card.iconbox .title{
        color: white;
    }
    card.iconbox:hover::after {
        box-shadow: 0px -281px 81px -241px rgba(0, 0, 0, 0.64) inset;
    }
    nav.style_box {
        box-shadow: 0 0 0.5rem var();
    }
    nav.style_box, nav.style_box ul li.left.title {
        background: white;
    }

    nav.style_box.mobileshow ul li {
        background: rgb(233, 233, 233);

    }
    nav.style_nobox:not(.white) ul li {
        color: rgb(20, 20, 20);
        text-shadow: 0 0 1.5rem var(--default-textshadow);
    }
    span.titlew,h2,h4,span.subtitlew {
        text-shadow: 0 0 1.5rem var(--default-textshadow);
    }
    card {
        background: #FBF8F8;
        box-shadow: var(--default-shadow);
    }
    card.cardButton.active {
        background: linear-gradient(180deg, #F8F7F7 30%, #e4e1e1 100%);
    }
    card.cardButton .value {
        color: #0c0c0c8f;
    }
    span.title2 {
        color: rgb(0, 0, 0);
        text-shadow: 0 0 1.5rem var(--default-textshadow);
    }
    nav.fixed.style_nobox:not(.mobileshow):not(.white)  {
        background: rgba(255, 255, 255, 0.8313725490196079);
    }
    group {
        color: rgb(15, 15, 15);
        text-shadow: 0 0 1.5rem var(--default-textshadow);
    }
    #particles-js {
        filter: invert(0.34) !important;
    }
    @media ( max-width: 950px) {
        nav.style_nobox.mobileshow ul li {
            color: rgb(218, 218, 218);
            text-shadow: none;
        }
    }
    card.popup list item:hover span.time {
        background: rgb(208, 208, 208);
    }

    cardlist card.right,cardlist card.left {
        transform: perspective(0);
    }
    card.iconbox img {
        filter: drop-shadow(0 0 6px rgba(0,0,0,0.2));
    }
    card.popup list.style2 item i {
        color: black;
    }
    .toggle.disabled input:checked + .slider {
        background: rgba(174, 162, 162, 0.14);
    }
    card.search ul {
        background: hsla(0, 0%, 98%, 1);
    }
    card.search ul li {
        border-bottom: 1px solid rgb(234, 232, 232);
    }
    card.search ul li:hover right i {
        color: #333333;
    }
    #fixedWindow {
        background: rgba(239, 238, 238, 0.91);
    }
`;