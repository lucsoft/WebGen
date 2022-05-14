import { ButtonStyle, Component } from "../../types.ts";
import * as validator from "https://deno.land/x/zod@v3.14.4/mod.ts";
import { View } from "../../lib/View.ts";
import { Horizontal, Spacer, Vertical } from "./Stacks.ts";
import { Button } from "./Button.ts";
import { assert } from "https://deno.land/std@0.134.0/testing/asserts.ts";

export type WizardActions = {
    PageID: () => number,
    PageSize: () => number,
    Cancel: () => void,
    Next: () => Promise<void> | void,
    Back: () => void,
    Submit: () => Promise<void> | void
}

export type WizardSettings = {
    cancelAction: (() => void) | string,
    hideCancelButton?: () => boolean,
    buttonArrangement?: "space-between" | "flex-start" | "flex-end" | ((actions: WizardActions) => Component)
    submitAction: (pages: { data: FormData }[]) => Promise<void> | void
    nextAction?: (pages: { data: FormData }[], pageId: number) => Promise<void> | void
}
export function ValidatedDataObject<Data extends validator.AnyZodObject>(validation: (factory: typeof validator) => Data) {
    return (data: unknown) => validation(validator).safeParse(data);
}

type Validator = (data: unknown) => validator.SafeParseReturnType<unknown, unknown>;

export class PageComponent {
    private formData = new FormData();
    private validators = new Set<Validator>()
    private components: Component[] = [];
    constructor(render: (formData: FormData) => Component[]) {
        this.components = render(this.formData);
    }
    getComponents() {
        return this.components;
    }
    addValidator<Data extends validator.AnyZodObject>(validation: (factory: typeof validator) => Data) {
        this.validators.add((data) => validation(validator).safeParse(data));
        return this;
    }

    getValidators() {
        return Array.from(this.validators.values());
    }

    getFormData() {
        return this.formData;
    }
}

export const Page = (comp: (formData: FormData) => Component[]) => new PageComponent(comp);

export class WizardComponent extends Component {
    private pages: PageComponent[] = [];
    private settings: WizardSettings | null = null;
    private pageId = 0;
    private view = View(() => {
        const { Back, Cancel, Next, Submit } = this.getActions();
        assert(this.settings);
        const firstPage = this.pageId === 0;
        const btnAr = this.settings.buttonArrangement;
        const lastPage = this.pageId === this.pages.length - 1;
        const cancel = firstPage && !(this.settings.hideCancelButton?.())
            ? Button("Cancel")
                .setJustify("center")
                .setStyle(ButtonStyle.Secondary)
                .onClick(Cancel)
            : null;
        const back = !firstPage
            ? Button("Back")
                .setJustify("center")
                .setStyle(ButtonStyle.Secondary)
                .onClick(Back)
            : null;
        const next = !lastPage && this.pages.length != 1 ?
            Button("Next")
                .setJustify("center")
                .onClick(Next)
            : null

        const submit = lastPage ?
            Button("Submit")
                .setJustify("center")
                .onClick(Submit)
            : null
        let footer = null;
        if (btnAr === "flex-start")
            footer = Horizontal(
                cancel,
                back,
                next,
                submit,
                Spacer()
            )
        else if (btnAr === "flex-end")
            footer = Horizontal(
                Spacer(),
                cancel,
                back,
                next,
                submit,
            )
        else if (btnAr === "space-between")
            footer = Horizontal(
                cancel,
                back,
                Spacer(),
                next,
                submit,
            )
        else if (typeof btnAr === "function")
            footer = btnAr(this.getActions())
        console.log(this.pageId, this.pages);
        return Vertical(
            ...this.pages[ this.pageId ].getComponents(),
            Spacer(),
            footer?.addClass("footer") ?? null
        ).addClass("wwizard")
    });
    constructor(settings: WizardSettings, pages: (actions: WizardActions) => PageComponent[]) {
        super();
        this.wrapper.classList;
        this.settings = settings;
        this.pages = pages(this.getActions());
        this.view.appendOn(this.wrapper)
    }

    getActions() {
        assert(this.settings)
        return <WizardActions>{
            Cancel: () => {
                if (typeof this.settings?.cancelAction == "string")
                    location.href = this.settings?.cancelAction;
                else this.settings?.cancelAction();
            },
            Back: () => {
                this.pageId--;
                this.view.viewOptions().update({});
            },
            Next: () => {
                this.pageId++;
                this.pages[ this.pageId ].getValidators().forEach(x => {
                    const response = x(this.pages[ this.pageId ].getFormData())
                    assert(response.success, JSON.stringify({ error: response }));
                })
                this.settings?.nextAction?.(this.pages.map(x => ({ data: x.getFormData() })), this.pageId);
                this.view.viewOptions().update({});
            },
            Submit: async () => {
                this.pages[ this.pageId ].getValidators().forEach(x => {
                    const response = x(this.pages[ this.pageId ].getFormData())
                    assert(response.success, JSON.stringify({ error: response }));
                })
                this.settings?.nextAction?.(this.pages.map(x => ({ data: x.getFormData() })), this.pageId);
                await this.settings?.submitAction(this.pages.map(x => ({ data: x.getFormData() })))
            },
            PageID: () => this.pageId,
            PageSize: () => this.pages.length,
        }
    }
}

export const Wizard = (settings: WizardSettings, pages: (actions: WizardActions) => PageComponent[]) => new WizardComponent(settings, pages);