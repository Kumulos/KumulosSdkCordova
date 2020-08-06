import 'whatwg-fetch';
import * as Client from './client';
export interface PushNotification {
    id: number;
    title?: string | null;
    message?: string | null;
    data?: {
        [key: string]: any;
    } | null;
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
export declare class PushChannelManager {
    private client;
    private headers;
    constructor(client: Client.Client, credentials: Client.Credentials);
    private makeSubscriptionRequest;
    /**
     * Subscribes to the channels given by unique ID
     *
     *  Channels that don't exist will be created.
     */
    subscribe(uuids: string[]): Promise<Response>;
    /**
     * Unsubscribes from the channels given by unique ID
     */
    unsubscribe(uuids: string[]): Promise<Response>;
    /**
     * Sets the current installations channel subscriptions to those given by unique ID.
     *
     * Any other subscriptions will be removed.
     */
    setSubscriptions(uuids: string[]): Promise<Response>;
    /**
     * Clears all of the existing installation's channel subscriptions
     */
    clearSubscriptions(): Promise<Response>;
    /**
     * Lists the channels available to this installation along with subscription status
     */
    listChannels(): Promise<PushChannel[]>;
    /**
     * Creates a push channel and optionally subscribes the current installation.
     *
     * Name is optional, but required if showInPortal is true.
     */
    createChannel(channelSpec: ChannelSpec): Promise<PushChannel>;
}
