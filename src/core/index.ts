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
    /**
     * Used to configure the Kumulos class. Only needs to be called once per process
     * 
     * @param {KumulosConfig} config - configuration for the client
     */
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
    /**
     * Get the Kumulos installation ID
     * @returns {Promise<string>} - the install ID
     */
    getInstallId: (): Promise<string> => {
        return clientInstance.getInstallId();
    },
    
    /**
     * Make an RPC call to a Backend API method
     * @param {string} methodName - Method alias to call
     * @param {object} params - Optional parameters
     * @returns {Promise<T>} - result of API call
     */
    call: <T>(methodName: string, params = {}): Promise<T> => {
        return clientInstance.call(methodName, params);
    },
    /**
     * Get the channel subscription manager
     * @returns {PushChannelManager}
     */
    getPushSubscriptionManager: (): PushChannelManager => {
        return clientInstance.pushChannels;
    },
    /**
     * Unsubscribe from push by removing the token associated with this installation
     * @returns {Promise<Response>}
     */
    pushRemoveToken: (): Promise<Response> => {
        return clientInstance.pushRemoveToken();
    },
    /**
     * Associates the given push token with this installation in Kumulos
     * @param {string} token - the push token from FCM or APNS
     */
    pushStoreToken: (token: string) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'pushStoreToken', [token]);
    },
    /**
     * Tracks a conversion event for a given push notification ID
     * @param {string} notificationId - the notification uuid
     */
    pushTrackOpen: (notificationId: string) => {
        Kumulos.trackEvent(KumulosEvent.PUSH_OPEN_TRACK, {
            id: notificationId
        });
    },
    /**
     * Tracks a custom analytics event with Kumulos.
     *
     * Events are persisted locally and synced to the server in the background in batches.
     * 
     * @param {string} eventType - Identifier for the event category
     * @param {object} properties - Optional additional information about the event
     */
    trackEvent: (eventType: string, properties: {} = null) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'trackEvent', [
            eventType,
            properties,
            false
        ]);
    },
    /**
     * Tracks a custom analytics event with Kumulos.
     *
     * After being recorded locally, all stored events will be flushed to the server.
     * 
     * @param {string} eventType - Identifier for the event category
     * @param {object} properties - Optional additional information about the event
     */
    trackEventImmediately: (eventType: string, properties: {} = null) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'trackEvent', [
            eventType,
            properties,
            true
        ]);
    },
    /**
     * Updates the location of the current installation in Kumulos
     * Accurate locaiton information is used for geofencing
     * @param {object} location - the coordinates of the device
     */
    sendLocationUpdate: (location: { lat: number, lng: number }) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'sendLocationUpdate', [
            location.lat,
            location.lng
        ]);
    },
    /**
     * Associates a user identifier with the current Kumulos installation record.
     * @param {string} userIdentifier - the unique user ID
     */
    associateUserWithInstall: (userIdentifier: string) => {
        cordova.exec(noop, noop, NATIVE_MODULE_NAME, 'associateUserWithInstall', [userIdentifier]);
    },
    /**
     * Records a proximity event for an Eddystone beacon. Proximity events can be used in automation rules.
     * @param {object} beacon - eddystone beacon information
     */
    trackEddystoneBeaconProximity: (beacon: { namespaceHex: string, instanceHex: string, distanceMetres?: number }) => {
        Kumulos.trackEventImmediately(KumulosEvent.ENGAGE_BEACON_ENTERED_PROXIMITY, {
            type: BeaconType.Eddystone,
            ...beacon
        });
    },
    /**
     * Records a proximity event for an iBeacon beacon. Proximity events can be used in automation rules.
     * @param {object} beacon - iBeacon beacon information
     */
    trackiBeaconProximity: (beacon: { uuid: string, major: number, minor: number, proximity?: number }) => {
        Kumulos.trackEventImmediately(KumulosEvent.ENGAGE_BEACON_ENTERED_PROXIMITY, {
            type: BeaconType.iBeacon,
            ...beacon
        });
    },

};

export default Kumulos;
