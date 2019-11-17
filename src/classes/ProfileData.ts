export class User
{
    username?: string;
    id?: string;
    avatar?: string;
    email?: string;
    icon?: string;
    createDate?: string;
    homes?: number[];
    type?: "developer" | "user" | "tester";
    permissions: (string)[] = [];
}
export class EmailPasswordAuth
{
    email?: string;
    password?: string;
}
export class IDTokenAuth
{
    id?: string;
    token?: string;
}
export class ProfileData
{
    user: User = new User();
    auth: IDTokenAuth = new IDTokenAuth();
    modules: any;
}