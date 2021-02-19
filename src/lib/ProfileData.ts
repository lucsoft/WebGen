export type User = {
    username?: string;
    id?: string;
    avatar?: string;
    email?: string;
    icon?: string;
    createDate?: string;
    homes?: number[];
    type?: "developer" | "user" | "tester";
    callMe?: string;
    permissions: (string)[];
}
export type EmailPasswordAuth = {
    email?: string;
    password?: string;
}
export type IDTokenAuth = {
    id?: string;
    token?: string;
}
export class ProfileData
{
    user: User = { permissions: [] };
    auth: IDTokenAuth = {};
    modules: any;
}