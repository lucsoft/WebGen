// deno-lint-ignore-file no-explicit-any
import { ButtonStyle, Component } from "../../types.ts";
import * as validator from "https://deno.land/x/zod@v3.19.1/mod.ts";
import { View } from "../../lib/View.ts";
import { CenterV, Horizontal, Spacer, Vertical } from "./Stacks.ts";
import { Button } from "./Button.ts";
import { assert } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { Color } from "../../lib/Color.ts";
import { PlainText } from "./PlainText.ts";
import { StateData, State, StateHandler } from "../../State.ts";

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

export type WizardSettings = {
    cancelAction?: (() => void) | string,
    buttonArrangement?: "space-between" | "flex-start" | "flex-end" | ((actions: WizardActions) => Component);
    buttonAlignment?: "bottom" | "top";
    submitAction: (pages: { data: validator.SafeParseSuccess<any>; }[]) => Promise<void> | void;
    onNextPage?: (data: WizardActions) => Promise<void>;
};
export function ValidatedDataObject<Data extends validator.ZodType>(validation: (factory: typeof validator) => Data) {
    return (data: unknown) => validation(validator).safeParse(data);
}

export type Validator = (data: unknown) => Promise<validator.SafeParseReturnType<unknown, unknown>>;

type PageData<data extends StateData> = (data: StateHandler<data>) => Component[];

export class PageComponent<Data extends StateData> {
    private proxyFormData: StateHandler<Data>;
    private validator?: Validator;
    private renderComponents: PageData<Data>;
    requestValidatorRun = () => { };
    #autoSpacer = true;
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
    private pageId = 0;
    private loading = false;
    private view = View(() => {
        const { Back, Cancel, Next, Submit, PageValid } = this.getActions();
        const footer = View<{ isValid: validator.SafeParseReturnType<any, any>; }>(({ update, state }) => {
            assert(this.settings);
            this.loading = false;
            const firstPage = this.pageId === 0;
            const btnAr = this.settings.buttonArrangement;
            const lastPage = this.pageId === this.pages.length - 1;
            const isValid = !state.isValid || state.isValid.success;
            const cancel = firstPage && this.settings.cancelAction
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
                    .setColor(isValid ? Color.Grayscaled : Color.Disabled)
                    .onPromiseClick(async () => {
                        if (this.loading) return;
                        this.loading = true;
                        const isValid = await PageValid();
                        if (isValid.success != true) return update({ isValid });
                        await Next();
                        update({ isValid });
                    })
                : null;
            const submit = lastPage ?
                Button("Submit")
                    .setJustify("center")
                    .setColor(isValid ? Color.Grayscaled : Color.Disabled)
                    .onPromiseClick(async () => {
                        if (this.loading) return;
                        this.loading = true;
                        const isValid = await PageValid();
                        if (isValid.success != true) return update({ isValid });
                        await Submit();
                        update({ isValid });
                    })
                : null;

            const errorMessage = state.isValid && state.isValid?.success !== true
                ? CenterV(
                    PlainText(getErrorMessage(state))
                        .addClass("error-message")
                        .setMargin("0 0.5rem 0 0")
                )
                : null;

            let footer: Component | null = null;
            if (btnAr === "flex-start")
                footer = Horizontal(cancel, back, errorMessage, next, submit, Spacer());
            else if (btnAr === "flex-end")
                footer = Horizontal(Spacer(), cancel, back, errorMessage, next, submit);
            else if (btnAr === "space-between")
                footer = Horizontal(cancel, back, Spacer(), errorMessage, next, submit);
            else if (typeof btnAr === "function")
                footer = btnAr(this.getActions());
            this.pages[ this.pageId ].requestValidatorRun = () => {
                update({ isValid: undefined });
            };
            return footer?.addClass("footer");
        }).asComponent();
        if (this.settings?.buttonAlignment == "top")
            return Vertical(
                footer,
                ...this.pages[ this.pageId ].getComponents()
            ).addClass("wwizard");
        else
            return Vertical(
                ...this.pages[ this.pageId ].getComponents(),
                footer
            ).addClass("wwizard");
    });
    constructor(settings: WizardSettings, pages: (actions: WizardActions) => PageComponent<any>[]) {
        super();
        this.wrapper.classList;
        this.settings = settings;
        this.pages = pages(this.getActions());
        this.view.appendOn(this.wrapper);
    }

    getActions() {
        assert(this.settings);
        const actions = <WizardActions>{
            Cancel: () => {
                if (!this.settings?.cancelAction) return;
                if (typeof this.settings?.cancelAction == "string")
                    location.href = this.settings?.cancelAction;
                else this.settings?.cancelAction();
            },
            Back: () => {
                this.pageId--;
                this.view.viewOptions().update({});
            },
            Next: async () => {
                await this.settings?.onNextPage?.(actions);
                this.pageId++;
                this.view.viewOptions().update({});
            },
            Submit: async () => {
                const data = await Promise.all(this.pages.map(x => (x.getValidator() ?? ANY_VALIDATOR)(x.getFormData())));
                await this.settings?.submitAction(data.map(data => ({ data: <validator.SafeParseSuccess<any>>data })));
            },
            PageValid: async () => {
                const current = this.pages[ this.pageId ];
                const pageData = JSON.parse(JSON.stringify(current.getFormData()));
                const validator: Validator = current.getValidator() ?? ANY_VALIDATOR;
                const data = await validator(pageData);
                console.debug("Page Input:", pageData);
                if (data.success)
                    console.debug("Page Result:", data.data);
                else
                    console.debug("Page Error:", data.error);
                return data;
            },
            ResponseData: () => {
                return Promise.all(this.pages.map(x => {
                    const pageData = x.getFormData();
                    const validator: Validator = x.getValidator() ?? ANY_VALIDATOR;

                    return validator(JSON.parse(JSON.stringify(pageData)));
                }));
            },
            PageID: () => this.pageId,
            PageSize: () => this.pages.length,
            PageData: () => {
                return this.pages.map(x => x.getFormData());
            }
        };
        return actions;
    }
}

export const Wizard = (settings: WizardSettings, pages: (actions: WizardActions) => PageComponent<any>[]) => new WizardComponent(settings, pages);

function getErrorMessage(state: Partial<{ isValid: validator.SafeParseReturnType<any, any>; }>): string {
    if (!(state.isValid && state.isValid?.success !== true)) return "";
    const selc = state.isValid.error.errors.find(x => x.code == "custom") ?? state.isValid.error.errors.find(x => x.message != "Required") ?? state.isValid.error.errors[ 0 ];

    // UpperCase and if number box it.
    const path = selc.path.map(x => typeof x == "number" ? `[${x}]` : x.replace(/^./, str => str.toUpperCase())).join("");

    return `${path}: ${selc.message}`;
}
