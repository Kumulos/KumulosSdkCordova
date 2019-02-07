import 'whatwg-fetch';
import * as Push from './push';
export declare class Client {
    private credentials;
    sessionToken: string;
    readonly pushChannels: Push.PushChannelManager;
    constructor(apiKey: string, secretKey: string);
    getInstallId(): Promise<string>;
    call(methodName: string, params?: {}): Promise<any>;
    private doCall;
    pushRemoveToken(): Promise<Response>;
    private checkStatus;
    private parseJson;
    private handleResponse;
}
export declare class Credentials {
    private apiKey;
    private secretKey;
    authString: string;
    private getAuthorizationString;
    constructor(apiKey: string, secretKey: string);
    getApiKey(): string;
}
