import 'whatwg-fetch';
import * as Push from './push';
export declare class Client {
    private credentials;
    sessionToken: string;
    readonly pushChannels: Push.PushChannelManager;
    constructor(apiKey: string, secretKey: string);
    getInstallId(): Promise<string>;
    call(methodName: string, params?: {}): Promise<any>;
    private doCall(installId, methodName, params?);
    pushRemoveToken(): Promise<Response>;
    private checkStatus(response);
    private parseJson(response);
    private handleResponse(data);
}
export declare class Credentials {
    private apiKey;
    private secretKey;
    authString: string;
    private getAuthorizationString();
    constructor(apiKey: string, secretKey: string);
    getApiKey(): string;
}
