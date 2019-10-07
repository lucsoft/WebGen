export declare class Functions {
    private urlParams;
    encrypt(str: string): string;
    decrypt(msg: string): string;
    getPara(type: string): string | null;
    setPara(name: string, val: string): void;
    request(xc: {
        url: string;
        data: any;
        methode: "GET" | "POST" | "DELETE" | "PUSH";
        header: {
            name: string;
            value: string;
        }[];
        error: (text: string, reponse: string, type: string, status: number) => any;
        response: (reponse: string, type: string, status: number) => any;
    }): void;
}
