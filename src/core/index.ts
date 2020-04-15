import * as cordova from 'cordova';

import {
    BeaconType,
    CrashReportFormat,
    KumulosEvent,
    NativeModuleName
} from './consts';
import { PushChannelManager, PushNotification } from './push';
import { empty, noop, nullOrUndefined } from './util';

import { Client } from './client';

export interface KumulosConfig {
    apiKey: string;
    secretKey: string;
    /**
     * Turn crash reporting on for JS layer (defaults to false)
     */
    enableCrashReporting?: boolean;
    /**
     * A version identifier for minified source maps you upload
     * used in JS error reporting source mapping
     */
    sourceMapTag?: string;
    /**
     * Called when your app receives a push notification
     */
    pushReceivedHandler?: (notification: PushNotification) => void;
    /**
     * Called when a user taps a push notificaiton. Use to implement
     * deep linking behavior.
     */
    pushOpenedHandler?: (notification: PushNotification) => void;
    /**
     * Called when a user taps a button with a deep link action from
     * an in-app message. Allows you to implement deep linking behavior.
     */
    inAppDeepLinkPressedHandler?: (data: { [key: string]: any }) => void;
}

interface InAppInboxItem {
    id: number;
    title: string;
    subtitle: string;
    availableFrom: string | '';
    availableTo: string | '';
    dismissedAt: string | '';
}

let currentConfig: KumulosConfig = null;
let clientInstance: Client = null;
let initialized: boolean = false;

let ravenInstance: any = null;
let exceptionsDuringInit = [];

function logException(e, uncaught: boolean, context: {} = undefined) {
    if (!initialized || !currentConfig.enableCrashReporting) {
        console.log(
            'Crash reporting has not been enabled, ignoring exception:'
        );
        console.error(e);
        return;
    }

    if (!ravenInstance) {
        exceptionsDuringInit.push([e, uncaught, context]);
        return;
    }

    ravenInstance.captureException(e, {
        uncaught,
        extra: context
    });
}

function nativeMessageHandler(message?: { type: string; data: any } | string) {
    if (!message || typeof message === 'string') {
        return;
    }

    const handlerName = `${message.type}Handler`;

    if (typeof currentConfig[handlerName] == 'function') {
        currentConfig[handlerName](message.data);
    } else {
        console.log(`Kumulos: No handler defined for '${message.type}' event`);
    }
}

const Kumulos = {
    /**
     * Used to configure the Kumulos class. Only needs to be called once per process
     *
     * @param {KumulosConfig} config - configuration for the client
     */
    initialize: (config: KumulosConfig) => {
        if (initialized) {
            console.error(
                'Kumulos.initialize has already been called, aborting...'
            );
            return;
        }

        if (empty(config.apiKey) || empty(config.secretKey)) {
            throw 'API key and secret key are required options!';
        }

        let args: any[] = [config.apiKey, config.secretKey];

        if (nullOrUndefined(config.enableCrashReporting)) {
            args.push(false);
        } else {
            args.push(config.enableCrashReporting);
        }

        cordova.exec(
            nativeMessageHandler,
            noop,
            NativeModuleName,
            'initBaseSdk',
            args
        );

        clientInstance = new Client(config.apiKey, config.secretKey);
        currentConfig = config;

        if (config.enableCrashReporting) {
            const transport = report => {
                Kumulos.trackEvent(KumulosEvent.CrashLoggedException, {
                    format: CrashReportFormat,
                    report: report.data
                });

                report.onSuccess();
            };

            import(/* webpackChunkName: "raven-js" */ 'raven-js')
                .then(Raven => {
                    // TODO typehinting as RavenOptions would be best but we can't
                    // see the type without static import so defeats points of import()
                    let ravenOpts: any = {
                        transport
                    };

                    if (config.sourceMapTag) {
                        ravenOpts.release = config.sourceMapTag;
                    }

                    ravenInstance = Raven.default.config(
                        'https://nokey@crash.kumulos.com/raven',
                        ravenOpts
                    );

                    ravenInstance.install();

                    exceptionsDuringInit.forEach(args =>
                        logException.apply(this, args)
                    );
                    exceptionsDuringInit = [];
                })
                .catch(e => console.error(e));
        }

        initialized = true;
    },

    /**
     * Get the Kumulos installation ID
     * @returns {Promise<string>} - the install ID
     */
    getInstallId: (): Promise<string> => {
        return clientInstance.getInstallId();
    },

    /**
     * Logs an exception to the Kumulos Crash reporting service
     *
     * Use this method to record unexpected application state
     */
    logException: (e, context: {} = {}) => {
        logException(e, false, context);
    },

    /**
     * Logs an uncaught exception to the Kumulos Crash reporting service
     *
     * Use this method to forward exceptions from other error handlers.
     */
    logUncaughtException: e => {
        logException(e, true);
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
     * Request a push token from the user and register for push notifications
     */
    pushRegister: (): void => {
        cordova.exec(noop, noop, NativeModuleName, 'pushRegister', []);
    },
    /**
     * Unsubscribe from push by removing the token associated with this installation
     */
    pushUnregister: (): void => {
        cordova.exec(noop, noop, NativeModuleName, 'pushUnregister', []);
    },
    /**
     * Opts the user in or out of in-app messaging
     *
     * Note the configured consent strategy in SDK initialization must
     * be set to EXPLICIT_BY_USER otherwise this method throws a runtime
     * exception.
     */
    inAppUpdateConsentForUser: (consented): void => {
        cordova.exec(noop, noop, NativeModuleName, 'inAppUpdateUserConsent', [
            Boolean(consented)
        ]);
    },
    /**
     * Gets a list of available in-app messages sent to the user and stored in the inbox
     */
    inAppGetInboxItems: (): Promise<InAppInboxItem> => {
        return new Promise((resolve, reject) => {
            cordova.exec(
                resolve,
                reject,
                NativeModuleName,
                'inAppGetInboxItems',
                []
            );
        });
    },
    /**
     * Presents the given in-app message to the user from the inbox
     */
    inAppPresentInboxMessage: (message: InAppInboxItem): Promise<void> => {
        return new Promise((resolve, reject) => {
            cordova.exec(
                resolve,
                reject,
                NativeModuleName,
                'inAppPresentInboxMessage',
                [message.id]
            );
        });
    },
    /**
     * Presents the given in-app message to the user from the inbox
     */
    inAppDeleteMessageFromInbox: (message: InAppInboxItem): Promise<void> => {
        return new Promise((resolve, reject) => {
            cordova.exec(
                resolve,
                reject,
                NativeModuleName,
                'inAppDeleteMessageFromInbox',
                [message.id]
            );
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
        cordova.exec(noop, noop, NativeModuleName, 'trackEvent', [
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
        cordova.exec(noop, noop, NativeModuleName, 'trackEvent', [
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
    sendLocationUpdate: (location: { lat: number; lng: number }) => {
        cordova.exec(noop, noop, NativeModuleName, 'sendLocationUpdate', [
            location.lat,
            location.lng
        ]);
    },
    /**
     * Associates a user identifier with the current Kumulos installation record.
     * @param {string} userIdentifier - the unique user ID
     * @param {object} attributes - optional attributes to set for the user (will overwrite any existing attributes)
     */
    associateUserWithInstall: (
        userIdentifier: string,
        attributes: {} = null
    ) => {
        cordova.exec(noop, noop, NativeModuleName, 'associateUserWithInstall', [
            userIdentifier,
            attributes
        ]);
    },
    /**
     * Clears any current user association with this install record
     */
    clearUserAssociation: () => {
        cordova.exec(noop, noop, NativeModuleName, 'clearUserAssociation', []);
    },
    /**
     * Gets the currently associated user identifier
     * @returns {Promise<string>} - the currently user identifier, or the install ID if none associated
     */
    getCurrentUserIdentifier: (): Promise<string> => {
        return new Promise((resolve, reject) => {
            cordova.exec(
                resolve,
                reject,
                NativeModuleName,
                'getCurrentUserId',
                []
            );
        });
    },
    /**
     * Records a proximity event for an Eddystone beacon. Proximity events can be used in automation rules.
     * @param {object} beacon - eddystone beacon information
     */
    trackEddystoneBeaconProximity: (beacon: {
        namespaceHex: string;
        instanceHex: string;
        distanceMetres?: number;
    }) => {
        Kumulos.trackEventImmediately(
            KumulosEvent.EngageBeaconEnteredProximity,
            {
                type: BeaconType.Eddystone,
                namespace: beacon.namespaceHex,
                instance: beacon.instanceHex,
                distanceMetres: beacon.distanceMetres
            }
        );
    },
    /**
     * Records a proximity event for an iBeacon beacon. Proximity events can be used in automation rules.
     * @param {object} beacon - iBeacon beacon information
     */
    trackiBeaconProximity: (beacon: {
        uuid: string;
        major: number;
        minor: number;
        proximity?: number;
    }) => {
        Kumulos.trackEventImmediately(
            KumulosEvent.EngageBeaconEnteredProximity,
            {
                type: BeaconType.iBeacon,
                ...beacon
            }
        );
    }
};

export default Kumulos;
