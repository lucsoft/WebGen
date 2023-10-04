// deno-lint-ignore-file no-explicit-any
import * as validator from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Component } from "../Component.ts";
import { State, StateData, StateHandler } from "../State.ts";
import { ButtonComponent } from "./Button.ts";
import { AlignComponent, Spacer } from "./Stacks.ts";

export type WizardActions = {
    PageID: () => number,
    PageSize: () => number,
    PageData: () => StateHandler<any>[],
    ResponseData: () => Promise<validator.SafeParseReturnType<any, any>[]>,
    PageValid: () => Promise<validator.SafeParseReturnType<any, any>>,
    Cancel: () => void,
    Next: () => Promise<void>,
    Back: () => void,
    Submit: () => Promise<void>,
};

type WizardActionButtons = {
    cancel: ButtonComponent | null;
    back: ButtonComponent | null;
    errorMessage: AlignComponent | null;
    next: ButtonComponent | null;
    submit: ButtonComponent | null;
};

export type Validator = (data: unknown) => Promise<validator.SafeParseReturnType<unknown, unknown>>;

type PageData<data extends StateData> = (data: StateHandler<data>) => Component[];

type PageJump = () => 'Next' | 'Back' | number;

export type WizardSettings = {
    cancelAction?: (() => void) | string,
    buttonArrangement?: "space-between" | "flex-start" | "flex-end" | ((actions: WizardActions, components: WizardActionButtons) => Component);
    buttonAlignment?: "bottom" | "top";
    submitAction: (pages: { data: validator.SafeParseSuccess<any>; }[]) => Promise<void> | void;
    onNextPage?: (data: WizardActions) => Promise<void>;
    onBackPage?: (data: WizardActions) => Promise<void>;
};
export function ValidatedDataObject<Data extends validator.ZodType>(validation: (factory: typeof validator) => Data) {
    return (data: unknown) => validation(validator).safeParse(data);
}


export class PageComponent<Data extends StateData> {
    private proxyFormData: StateHandler<Data>;
    private validator?: Validator;
    private renderComponents: PageData<Data>;
    requestValidatorRun = () => { };
    #autoSpacer = true;
    nextPage: PageJump = () => "Next";
    backPage: PageJump = () => "Back";
    constructor(data: Data, renderComponents: PageData<Data>) {
        this.renderComponents = renderComponents;
        this.proxyFormData = State(data);
        for (const iterator of Object.keys(data)) {
            this.proxyFormData.$on(iterator, () => {
                this.requestValidatorRun();
            });
        }
    }

    getComponents() {
        return [ ...this.renderComponents(this.proxyFormData), ...(this.#autoSpacer ? [ Spacer() ] : []) ];
    }
    setValidator<Data extends validator.ZodType>(validation: (factory: typeof validator) => Data) {
        this.validator = (data) => validation(validator).safeParseAsync(data);
        return this;
    }
    disableAutoSpacerAtBottom() {
        this.#autoSpacer = false;
        return this;
    }
    getValidator() {
        return this.validator;
    }

    getFormData() {
        return this.proxyFormData;
    }

    getNextPage() {
        return this.nextPage();
    }

    setNextPage(type: PageJump) {
        this.nextPage = type;
        return this;
    }

    getBackPage() {
        return this.backPage();
    }

    setBackPage(type: PageJump) {
        this.backPage = type;
        return this;
    }
}
/**
 * Pages only update via a page change from a wizard or components itself via events
 *
 * Upsides:
 *  - Inputs have a simple way to sync there data in a Page
 *  - Simpler work for a Wizard as it only cares about the data
 *  - Supports Validators. Validators parse the Data used in validators
 *
 * Downside:
 *  - Pages are by design not dynamic. (Use a Wizard or a View)
 */
export const Page = <Data extends StateData>(data: Data, comp: PageData<Data>) => new PageComponent(data, comp);
const ANY_VALIDATOR = () => validator.any().safeParseAsync({});
export class WizardComponent extends Component {
    private pages: PageComponent<any>[] = [];
    private settings: WizardSettings | null = null;
    state = State({
        loading: false,
        pageId: 0,
        isValid: <validator.SafeParseReturnType<any, any> | undefined>undefined
    });
    // private view = () => {
    //     const { Back, Cancel, Next, Submit, PageValid } = this.getActions();
    //     const state = this.state;
    //     const footer = () => {
    //         assert(this.settings);
    //         this.loading = false;
    //         const firstPage = this.pageId === 0;
    //         const btnAr = this.settings.buttonArrangement;
    //         const lastPage = this.pageId === this.pages.length - 1;
    //         const isValid = !state.isValid || state.isValid.success;
    //         const cancel = firstPage && this.settings.cancelAction
    //             ? Button("Cancel")
    //                 .setJustify("center")
    //                 .setStyle(ButtonStyle.Secondary)
    //                 .onClick(Cancel)
    //             : null;
    //         const back = !firstPage
    //             ? Button("Back")
    //                 .setJustify("center")
    //                 .setStyle(ButtonStyle.Secondary)
    //                 .onClick(Back)
    //             : null;
    //         const next = !lastPage && this.pages.length != 1 ?
    //             Button("Next")
    //                 .setJustify("center")
    //                 .setColor(isValid ? Color.Grayscaled : Color.Disabled)
    //                 .onPromiseClick(async () => {
    //                     if (this.loading) return;
    //                     this.loading = true;
    //                     const isValid = await PageValid();
    //                     if (isValid.success == true) await Next();
    //                     state.isValid = isValid;
    //                 })
    //             : null;
    //         const submit = lastPage ?
    //             Button("Submit")
    //                 .setJustify("center")
    //                 .setColor(isValid ? Color.Grayscaled : Color.Disabled)
    //                 .onPromiseClick(async () => {
    //                     if (this.loading) return;
    //                     this.loading = true;
    //                     const isValid = await PageValid();
    //                     if (isValid.success == true) await Submit();
    //                     state.isValid = isValid;
    //                 })
    //             : null;

    //         const errorMessage = state.isValid && state.isValid?.success !== true
    //             ? CenterV(
    //                 Label(getErrorMessage(state))
    //                     .addClass("error-message")
    //                     .setMargin("0 0.5rem 0 0")
    //             )
    //             : null;

    //         let footer: Component | null = null;
    //         if (btnAr === "flex-start")
    //             footer = Horizontal(cancel, back, next, submit, Spacer(), errorMessage);
    //         else if (btnAr === "flex-end")
    //             footer = Horizontal(errorMessage, Spacer(), cancel, back, next, submit);
    //         else if (btnAr === "space-between")
    //             footer = Horizontal(cancel, back, Spacer(), errorMessage, next, submit);
    //         else if (typeof btnAr === "function")
    //             footer = btnAr(this.getActions(), { cancel, back, errorMessage, next, submit });
    //         this.pages[ this.pageId ].requestValidatorRun = () => {
    //             state.isValid = undefined;
    //         };
    //         return footer?.addClass("footer");
    //     };
    //     if (this.settings?.buttonAlignment == "top")
    //         return Vertical(
    //             footer() ?? Box(),
    //             ...this.pages[ this.pageId ].getComponents()
    //         ).addClass("wwizard");
    //     else
    //         return Vertical(
    //             ...this.pages[ this.pageId ].getComponents(),
    //             footer() ?? Box()
    //         ).addClass("wwizard");
    // };
    constructor(settings: WizardSettings, pages: (actions: WizardActions) => PageComponent<any>[]) {
        super();
        this.wrapper.classList;
        this.settings = settings;
        pages(undefined!);
        // this.pages = pages(this.getActions());
        // this.wrapper.append(this.view().draw());
    }

    jumpPage(type: ReturnType<PageJump>) {
        if (type == "Back")
            this.state.pageId--;
        else if (type == "Next")
            this.state.pageId++;
        else this.state.pageId = type;
    }

    // getActions() {
    //     assert(this.settings);
    //     const actions = <WizardActions>{
    //         Cancel: () => {
    //             if (!this.settings?.cancelAction) return;
    //             if (typeof this.settings?.cancelAction == "string")
    //                 location.href = this.settings?.cancelAction;
    //             else this.settings?.cancelAction();
    //         },
    //         Back: async () => {
    //             await this.settings?.onBackPage?.(actions);
    //             this.jumpPage(this.pages[ this.pageId ].getBackPage());
    //         },
    //         Next: async () => {
    //             await this.settings?.onNextPage?.(actions);
    //             this.jumpPage(this.pages[ this.pageId ].getNextPage());
    //         },
    //         Submit: async () => {
    //             const data = await Promise.all(this.pages.map(x => (x.getValidator() ?? ANY_VALIDATOR)(x.getFormData())));
    //             await this.settings?.submitAction(data.map(data => ({ data: <validator.SafeParseSuccess<any>>data })));
    //         },
    //         PageValid: async () => {
    //             const current = this.pages[ this.pageId ];
    //             const pageData = JSON.parse(JSON.stringify(current.getFormData()));
    //             const validator: Validator = current.getValidator() ?? ANY_VALIDATOR;
    //             const data = await validator(pageData);
    //             console.debug("Page Input:", pageData);
    //             if (data.success)
    //                 console.debug("Page Result:", data.data);
    //             else
    //                 console.debug("Page Error:", data.error);
    //             return data;
    //         },
    //         ResponseData: () => {
    //             return Promise.all(this.pages.map(x => {
    //                 const pageData = x.getFormData();
    //                 const validator: Validator = x.getValidator() ?? ANY_VALIDATOR;

    //                 return validator(JSON.parse(JSON.stringify(pageData)));
    //             }));
    //         },
    //         PageID: () => this.pageId,
    //         PageSize: () => this.pages.length,
    //         PageData: () => {
    //             return this.pages.map(x => x.getFormData());
    //         }
    //     };
    //     return actions;
    // }
}

export const Wizard = (settings: WizardSettings, pages: (actions: WizardActions) => PageComponent<any>[]) => new WizardComponent(settings, pages);

export function getErrorMessage(state: Partial<{ isValid: validator.SafeParseReturnType<any, any>; }>): string {
    if (!(state.isValid && state.isValid?.success !== true)) return "";
    const selc = state.isValid.error.errors.find(x => x.code == "custom" && x.message != "Invalid input") ?? state.isValid.error.errors.find(x => x.message != "Required") ?? state.isValid.error.errors[ 0 ];

    // UpperCase and if number box it.
    const path = selc.path.map(x => typeof x == "number" ? `[${x}]` : x.replace(/^./, str => str.toUpperCase())).join("");

    return `${path}: ${selc.message}`;
}
