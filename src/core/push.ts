import 'whatwg-fetch';

import * as Client from './client';
import * as Enums from './enums';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface PushNotification {
    id: number;
    title?: string | null;
    message?: string | null;
    data?: { [key: string]: any } | null;
    url?: string | null;
}

export interface PushChannel {
    uuid: string;
    name?: string;
    subscribed: Boolean;
    meta?: any;
}

export interface ChannelSpec {
    uuid: string;
    subscribe: boolean;
    meta?: any;
    name?: string;
    showInPortal?: boolean;
}

export class PushChannelManager {
    private client: Client.Client;
    private headers: Headers;

    constructor(client: Client.Client, credentials: Client.Credentials) {
        this.client = client;
        this.headers = new Headers();
        this.headers.append('Authorization', credentials.authString);
        this.headers.append('Content-Type', 'application/json; charset=utf-8');
        this.headers.append('Accept', 'application/json');
    }

    private makeSubscriptionRequest(
        method: HttpMethod,
        uuids: string[]
    ): Promise<Response> {
        return this.client.getCurrentUserIdentifier().then(userIdentifier => {
            const url = `${Enums.CrmBaseUrl}/v1/users/${encodeURIComponent(userIdentifier)}/channels/subscriptions`;
            const params = {
                uuids
            };

            const options = {
                method,
                headers: this.headers,
                body: JSON.stringify(params)
            };

            return fetch(url, options);
        });
    }

    /**
     * Subscribes to the channels given by unique ID
     *
     *  Channels that don't exist will be created.
     */
    subscribe(uuids: string[]): Promise<Response> {
        return this.makeSubscriptionRequest('POST', uuids);
    }

    /**
     * Unsubscribes from the channels given by unique ID
     */
    unsubscribe(uuids: string[]): Promise<Response> {
        return this.makeSubscriptionRequest('DELETE', uuids);
    }

    /**
     * Sets the current installations channel subscriptions to those given by unique ID.
     *
     * Any other subscriptions will be removed.
     */
    setSubscriptions(uuids: string[]): Promise<Response> {
        return this.makeSubscriptionRequest('PUT', uuids);
    }

    /**
     * Clears all of the existing installation's channel subscriptions
     */
    clearSubscriptions(): Promise<Response> {
        return this.setSubscriptions([]);
    }

    /**
     * Lists the channels available to this installation along with subscription status
     */
    listChannels(): Promise<PushChannel[]> {
        return this.client
            .getCurrentUserIdentifier()
            .then<Response>(userIdentifier => {
                const url = `${Enums.CrmBaseUrl}/v1/users/${encodeURIComponent(userIdentifier)}/channels`;
                const options = {
                    method: 'GET',
                    headers: this.headers
                };

                return fetch(url, options);
            })
            .then(response => {
                return response.json();
            });
    }

    /**
     * Creates a push channel and optionally subscribes the current installation.
     *
     * Name is optional, but required if showInPortal is true.
     */
    createChannel(channelSpec: ChannelSpec): Promise<PushChannel> {
        if (
            channelSpec.showInPortal &&
            (!channelSpec.name || !channelSpec.name.length)
        ) {
            return Promise.reject({
                error:
                    'Name is required for channel creation when showInPortal is true'
            });
        }

        return this.client
            .getCurrentUserIdentifier()
            .then<Response>(userIdentifier => {
                const url = `${Enums.CrmBaseUrl}/v1/channels`;

                let params: any = {
                    uuid: channelSpec.uuid,
                    name: channelSpec.name,
                    showInPortal: Boolean(channelSpec.showInPortal),
                    meta: channelSpec.meta
                };

                if (channelSpec.subscribe) {
                    params.userIdentifier = userIdentifier;
                }

                const options = {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(params)
                };

                return fetch(url, options);
            })
            .then(response => {
                return response.json();
            });
    }
}
