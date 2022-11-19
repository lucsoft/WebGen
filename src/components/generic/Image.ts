import { Box, Component, createElement, Custom, loadingWheel, PlainText, Spacer, Vertical } from "../../webgen.ts";
import '../../css/image.webgen.static.css';
export type AdvancedImage =
    | { type: "direct", source: () => Promise<Blob>; }
    | { type: "loading"; }
    | { type: "uploading"; percentage: number; filename: string; text?: string; blobUrl: string; }
    | { type: "waiting-upload"; filename: string; text?: string; blobUrl: string; }
    ;

export class ImageComponent extends Component {
    alt: string;

    constructor(data: string | AdvancedImage, alt: string) {
        super();
        this.alt = alt;
        this.wrapper.classList.add("wimage");
        if (typeof data == "string") {
            this.wrapper.append(this.renderImage(data));
        }
        else if (data.type == "direct") {
            this.wrapper.classList.add("loading");
            this.wrapper.append(this.renderLoading());
            data.source().then(x => {
                this.wrapper.classList.remove("loading");
                this.wrapper.children[ 0 ].replaceWith(this.renderImage(URL.createObjectURL(x)));
            });
        } else if (data.type == "loading") {
            this.wrapper.classList.add("loading");
            this.wrapper.append(this.renderLoading());
        } else if (data.type == "uploading") {
            const background = this.renderImage(data.blobUrl);
            background.classList.add("background");
            const progress = Box(Custom(this.renderImage(data.blobUrl))).draw();
            progress.classList.add("progress");
            progress.style.height = `${data.percentage.toFixed(1)}%`;
            const overlay = Vertical(
                Spacer(),
                PlainText(data.text ?? "Uploading...").addClass("small"),
                Spacer(),
                PlainText(`${data.percentage.toFixed(1)}%`).addClass("big"),
                Spacer(),
                PlainText(data.filename).addClass("small"),
                Spacer()
            ).addClass("overlay").draw();
            const darkLayer = Box().addClass("dark-layer").draw();
            this.wrapper.append(background, progress, darkLayer, overlay);
        } else if (data.type == "waiting-upload") {
            const background = this.renderImage(data.blobUrl);
            background.classList.add("background");
            const progress = Box(Custom(this.renderImage(data.blobUrl))).draw();
            progress.classList.add("progress");
            progress.style.height = `100%`;
            const overlay = Vertical(
                Spacer(),
                PlainText(" ").addClass("small"),
                Spacer(),
                PlainText(data.text ?? "Finishing Upload...").addClass("mid"),
                Spacer(),
                PlainText(data.filename).addClass("small"),
                Spacer()
            ).addClass("overlay").draw();
            const darkLayer = Box().addClass("dark-layer").draw();
            this.wrapper.append(background, progress, darkLayer, overlay);
        }
    }
    private renderLoading() {
        return loadingWheel() as Element as HTMLElement;
    }
    private renderImage(source: string) {
        const img = createElement("img");
        img.style.width = "100%";
        img.src = source;
        img.alt = this.alt;
        return img;
    }
}

export const Image = (data: string | AdvancedImage, alt: string) => new ImageComponent(data, alt);
