
// import { createElement, custom, span } from "../components/Components";
// import { CardTypes, CommonCard } from "../types/card";

// export class WebGenElements {
//     private ele: HTMLElement;
//     last: HTMLElement;

//     constructor(element: HTMLElement) {
//         this.ele = element;
//         this.last = element;
//     }

//     setStyle = (style: string) => this.ele.setAttribute("style", style)

//     /**
//      * # Actions
//      * @value (CardsArray)
//      */
//     cards({ minColumnWidth, maxWidth, gap }: {
//         minColumnWidth?: number,
//         maxWidth?: string,
//         gap?: number
//     }, ...cardArray: CommonCard[]) {
//         let element = createElement("cardlist");
//         if (minColumnWidth)
//             element.style.setProperty('--card-min-width', minColumnWidth + "rem")
//         if (maxWidth)
//             element.style.setProperty('--max-width', maxWidth)
//         if (gap)
//             element.style.setProperty('--gap', minColumnWidth + "rem")

//         element.addEventListener("value", (action: any) => {
//             element.innerHTML = "";
//             reRenderCards((action as CustomEvent).detail);
//         })
//         const reRenderCards = (elements: CommonCard[]) => {
//             for (const cmCard of elements) {
//                 const card = createElement('card');

//                 if (cmCard.height && cmCard.height > 0)
//                     card.style.gridRow = `span ${cmCard.height}`;

//                 if (cmCard.width && cmCard.width > 0)
//                     card.style.gridColumn = `span calc(${cmCard.width})`;

//                 if (cmCard.type == CardTypes.Headless) {
//                     card.append(cmCard.html)
//                     element.append(card);
//                 } else if (cmCard.type == CardTypes.Default) {
//                     if (cmCard.small) card.classList.add("small");
//                     card.classList.add("lline")
//                     card.append(custom('h1', cmCard.title, 'title'));
//                     if (cmCard.subtitle) {
//                         card.classList.add("subtitle")
//                         card.append(span(cmCard.subtitle, 'subtitle'));
//                     }

//                     element.append(card);
//                 }
//             }
//         };
//         reRenderCards(cardArray);
//         this.ele.append(element);
//         this.last = element;
//         return this;
//     }

//     /**
//      * What theme? just use modern
//      */
//     splitView(settings: {
//         theme?: "list" | "modern" | "one" | "auto";
//         left: (HTMLElement | (WebGenElements & { last: HTMLElement; }))[],
//         right: (HTMLElement | (WebGenElements & { last: HTMLElement; }))[],
//         nomargin?: boolean,
//         defaultContentPadding?: boolean,
//         sidebarIsList?: boolean,
//         maxWidth?: string | "default"
//     }) {
//         let element = createElement('splitView');
//         element.classList.add(settings.theme == undefined || settings.theme == "modern" ? 'm' : settings.theme);
//         if (settings.maxWidth)
//             element.classList.add('maxWidth');

//         if (settings.maxWidth && settings.maxWidth != "default")
//             element.style.maxWidth = settings.maxWidth;

//         if (settings.nomargin)
//             element.classList.add('nomargin');

//         let sidebar = createElement('sidebar')
//         if (settings.theme == "one")
//             sidebar.classList.add('d');

//         if (settings.sidebarIsList)
//             sidebar.classList.add('list');

//         let content = createElement('content');
//         if (settings.defaultContentPadding)
//             content.style.padding = "1rem";

//         settings.left.forEach((x) => {
//             sidebar.append(x instanceof HTMLElement ? x : x.last)
//         });
//         settings.right.forEach((x) => {
//             content.append(x instanceof HTMLElement ? x : x.last)
//         });
//         element.append(sidebar);
//         element.append(content);
//         this.ele.append(element);
//         this.last = element;
//         return this;
//     }


// }