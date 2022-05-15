import { ButtonStyle, Component } from "../../types.ts";
import * as validator from "https://deno.land/x/zod@v3.14.4/mod.ts";
import { View } from "../../lib/View.ts";
import { Horizontal, Spacer, Vertical } from "./Stacks.ts";
import { Button } from "./Button.ts";
import { assert } from "https://deno.land/std@0.134.0/testing/asserts.ts";
import { Color } from "../../lib/Color.ts";

export type WizardActions = {
    PageID: () => number,
    PageSize: () => number,
    PageData: () => FormData[],
    PageValid: () => validator.SafeParseError<unknown> | true,
    Cancel: () => void,
    Next: () => Promise<void> | void,
    Back: () => void,
    Submit: () => Promise<void> | void,
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

export type Validator = (data: unknown) => validator.SafeParseReturnType<unknown, unknown>;

type NewType = (formData: FormData, errorMap?: validator.ZodError) => Component[];

export class PageComponent {
    private formData = new FormData();
    private validators = new Set<Validator>()
    private renderComponents: NewType;
    constructor(renderComponents: NewType) {
        this.renderComponents = renderComponents;
    }
    getComponents(errorMap?: validator.ZodError) {
        return this.renderComponents(this.formData, errorMap);
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
/**
 * Pages are Strict Layout Views, mostly only used by a Wizard
 *
 * Upsides:
 *  - Inputs have a simple way to sync there data in a Page
 *  - Simpler work for a Wizard as it only cares about the data
 *  - Supports Validators. Validators can suport the FormData
 *
 * Downside:
 *  - Pages are not design to have dynamic layouts. (Use a Wizard)
 *  - Components can't listen on changes. They only reflect on errors.
 */
export const Page = (comp: (formData: FormData) => Component[]) => new PageComponent(comp);

export class WizardComponent extends Component {
    private pages: PageComponent[] = [];
    private settings: WizardSettings | null = null;
    private pageId = 0;
    private view = View(() => {
        const { Back, Cancel, Next, Submit, PageValid } = this.getActions();
        assert(this.settings);
        const firstPage = this.pageId === 0;
        const btnAr = this.settings.buttonArrangement;
        const lastPage = this.pageId === this.pages.length - 1;
        const pageValid = PageValid();
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
                .setColor(pageValid ? Color.Grayscaled : Color.Disabled)
                .onClick(Next)
            : null
        const submit = lastPage ?
            Button("Submit")
                .setJustify("center")
                .setColor(pageValid ? Color.Grayscaled : Color.Disabled)
                .onClick(Submit)
            : null

        let footer = null;
        if (btnAr === "flex-start")
            footer = Horizontal(cancel, back, next, submit, Spacer())
        else if (btnAr === "flex-end")
            footer = Horizontal(Spacer(), cancel, back, next, submit)
        else if (btnAr === "space-between")
            footer = Horizontal(cancel, back, Spacer(), next, submit)
        else if (typeof btnAr === "function")
            footer = btnAr(this.getActions())

        return Vertical(
            ...this.pages[ this.pageId ].getComponents(pageValid == true ? undefined : pageValid.error),
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
        const actions = <WizardActions>{
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
                assert(actions.PageValid());
                this.settings?.nextAction?.(this.pages.map(x => ({ data: x.getFormData() })), this.pageId);
                this.pageId++;
                this.view.viewOptions().update({});
            },
            Submit: async () => {
                assert(actions.PageValid());
                this.settings?.nextAction?.(this.pages.map(x => ({ data: x.getFormData() })), this.pageId);
                await this.settings?.submitAction(this.pages.map(x => ({ data: x.getFormData() })))
            },
            PageValid: () => {
                const current = this.pages[ this.pageId ];
                const pageData = current.getFormData();
                return current.getValidators()
                    .map(validator => validator(pageData))
                    .find(validator => !validator.success) ?? true;
            },
            PageID: () => this.pageId,
            PageSize: () => this.pages.length,
            PageData: () => {
                return this.pages.map(x => x.getFormData())
            }
        }
        return actions;
    }
}

export const Wizard = (settings: WizardSettings, pages: (actions: WizardActions) => PageComponent[]) => new WizardComponent(settings, pages);