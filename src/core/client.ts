import 'whatwg-fetch';

import * as Enums from './enums';
import * as Push from './push';
import * as cordova from 'cordova';

import { empty, generateUUID, urlEncodedParams } from './util';

import { NativeModuleName } from './consts';

export class Client {
    private credentials: Credentials;

    public sessionToken: string;
    public readonly pushChannels: Push.PushChannelManager;

    constructor(apiKey: string, secretKey: string) {
        this.credentials = new Credentials(apiKey, secretKey);
        this.sessionToken = generateUUID();

        this.pushChannels = new Push.PushChannelManager(this, this.credentials);
    }

    public getInstallId(): Promise<string> {
        return new Promise((resolve, reject) => {
            cordova.exec(resolve, reject, NativeModuleName, 'getInstallId', []);
        });
    }

    public getUserIdentifier(): Promise<string> {
        return new Promise((resolve, reject) => {
            cordova.exec(resolve, reject, NativeModuleName, 'getCurrentUserId', []);
        });
    }

    public call(methodName: string, params = {}) {
        return this.getInstallId().then(installId =>
            this.doCall(installId, methodName, params)
        );
    }

    private doCall(installId: string, methodName: string, params = {}) {
        if (
            methodName == null ||
            methodName == undefined ||
            methodName.trim() == ''
        ) {
            throw new Error('API method cannot be empty.');
        }

        const apiKey = this.credentials.getApiKey();
        const url = Enums.ClientBaseUrl + `/b2.2/${apiKey}/${methodName}.json`;

        let headers = new Headers();
        headers.append('Authorization', this.credentials.authString);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        const body = urlEncodedParams({
            installId,
            sessionToken: this.sessionToken,
            params
        });

        const options = {
            method: 'POST',
            headers: headers,
            body
        };

        return fetch(url, options)
            .then(response => this.checkStatus(response))
            .then(response => this.parseJson(response))
            .then(response => this.handleResponse(response))
            .catch(error => {
                throw error;
            });
    }

    private checkStatus(response: Response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            let responseError = new ReponseError(response.statusText);
            responseError.response = response;
            throw responseError;
        }
    }

    private parseJson(response: Response) {
        return response.json();
    }

    private handleResponse(data: any) {
        if (data.sessionToken != null) {
            this.sessionToken = data.sessionToken;
        }

        switch (data.responseCode) {
            case Enums.ResponseCode.SUCCESS:
                return data.payload;
            default:
                return Promise.reject(data);
        }
    }
}

class ReponseError extends Error {
    public response: Response;
}

export class Credentials {
    private apiKey: string;
    private secretKey: string;
    public authString: string;

    private getAuthorizationString() {
        return `Basic ${btoa(`${this.apiKey}:${this.secretKey}`)}`;
    }

    constructor(apiKey: string, secretKey: string) {
        if (empty(apiKey)) {
            throw new Error('API Key cannot be empty.');
        }

        if (empty(secretKey)) {
            throw new Error('Secret Key cannot be empty.');
        }

        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.authString = this.getAuthorizationString();
    }

    public getApiKey(): string {
        return this.apiKey;
    }
}
