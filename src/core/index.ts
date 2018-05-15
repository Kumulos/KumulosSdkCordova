import * as cordova from 'cordova';

import { BeaconType, CordovaRuntimeType, KumulosEvent, NATIVE_MODULE_NAME, SdkInfo } from './consts';
import { empty, noop, nullOrUndefined } from './util';

import { Client } from './client';
import { PushChannelManager } from './push';

export interface KumulosConfig {
    apiKey: string;
    secretKey: string;
    enableCrashReporting?: boolean;
}

let clientInstance: Client = null;

const Kumulos = {
    // Initialize the Kumulos SDK
    initialize: (config: KumulosConfig) => {
        if (empty(config.apiKey) || empty(config.secretKey)) {
            throw "API key and secret key are required options!";
        }

        let args: any[] = [
            config.apiKey,
            config.secretKey
        ];

        if (nullOrUndefined(config.enableCrashReporting)) {
            args.push(false);
        }
        else {
            args.push(config.enableCrashReporting);
        }

        // SDK info
        args.push(SdkInfo);

        // Runtime info
        args.push({
            id: CordovaRuntimeType,
            version: cordova.version
        });

        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'initBaseSdk', args);

        clientInstance = new Client(config.apiKey, config.secretKey);
    },
    // Get the Kumulos installation ID
    getInstallId: (): Promise<string> => {
        return clientInstance.getInstallId();
    },
    // Backend RPC API calls
    call: <T>(methodName: string, params = {}): Promise<T> => {
        return clientInstance.call(methodName, params);
    },
    // Access the push channel subscriptions manager
    getPushSubscriptionManager: (): PushChannelManager => {
        return clientInstance.pushChannels;
    },
    // Unsubscribe from push by removing the token associated with this installation
    pushRemoveToken: (): Promise<Response> => {
        return clientInstance.pushRemoveToken();
    },
    pushStoreToken: (token: string) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'pushStoreToken', [token]);
    },
    pushTrackOpen: (notificationId: string) => {
        Kumulos.trackEvent(KumulosEvent.PUSH_OPEN_TRACK, {
            id: notificationId
        });
    },
    trackEvent: (eventType: string, properties: {} = null) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'trackEvent', [
            eventType,
            properties,
            false
        ]);
    },
    trackEventImmediately: (eventType: string, properties: {} = null) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'trackEvent', [
            eventType,
            properties,
            true
        ]);
    },
    sendLocationUpdate: (location: { lat: number, lng: number }) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'sendLocationUpdate', [
            location.lat,
            location.lng
        ]);
    },
    associateUserWithInstall: (userIdentifier: string) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'associateUserWithInstall', [userIdentifier]);
    },
    trackEddystoneBeaconProximity: (beacon: { namespaceHex: string, instanceHex: string }) => {
        Kumulos.trackEventImmediately(KumulosEvent.ENGAGE_BEACON_ENTERED_PROXIMITY, {
            type: BeaconType.Eddystone,
            ...beacon
        });
    },
    trackiBeaconProximity: (beacon: { uuid: string, major: number, minor: number, proximity?: number }) => {
        Kumulos.trackEventImmediately(KumulosEvent.ENGAGE_BEACON_ENTERED_PROXIMITY, {
            type: BeaconType.iBeacon,
            ...beacon
        });
    },

};

export default Kumulos;
