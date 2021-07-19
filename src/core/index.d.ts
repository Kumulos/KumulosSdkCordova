import { PushChannelManager, PushNotification } from './push';
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
    inAppDeepLinkPressedHandler?: (data: {
        [key: string]: any;
    }) => void;
}
interface InAppInboxItem {
    id: number;
    title: string;
    subtitle: string;
    availableFrom: string | '';
    availableTo: string | '';
    dismissedAt: string | '';
    isRead: boolean;
    sentAt?: string;
    data?: {
        [key: string]: any;
    };
    imageUrl?: string;
}
interface InAppInboxSummary {
    totalCount: number;
    unreadCount: number;
}
declare const Kumulos: {
    /**
     * Used to configure the Kumulos class. Only needs to be called once per process
     *
     * @param {KumulosConfig} config - configuration for the client
     */
    initialize: (config: KumulosConfig) => void;
    /**
     * Get the Kumulos installation ID
     * @returns {Promise<string>} - the install ID
     */
    getInstallId: () => Promise<string>;
    /**
     * Logs an exception to the Kumulos Crash reporting service
     *
     * Use this method to record unexpected application state
     */
    logException: (e: any, context?: {}) => void;
    /**
     * Logs an uncaught exception to the Kumulos Crash reporting service
     *
     * Use this method to forward exceptions from other error handlers.
     */
    logUncaughtException: (e: any) => void;
    /**
     * Make an RPC call to a Backend API method
     * @param {string} methodName - Method alias to call
     * @param {object} params - Optional parameters
     * @returns {Promise<T>} - result of API call
     */
    call: <T>(methodName: string, params?: {}) => Promise<T>;
    /**
     * Get the channel subscription manager
     * @returns {PushChannelManager}
     */
    getPushSubscriptionManager: () => PushChannelManager;
    /**
     * Request a push token from the user and register for push notifications
     */
    pushRegister: () => void;
    /**
     * Unsubscribe from push by removing the token associated with this installation
     */
    pushUnregister: () => void;
    /**
     * Tracks a custom analytics event with Kumulos.
     *
     * Events are persisted locally and synced to the server in the background in batches.
     *
     * @param {string} eventType - Identifier for the event category
     * @param {object} properties - Optional additional information about the event
     */
    trackEvent: (eventType: string, properties?: {}) => void;
    /**
     * Tracks a custom analytics event with Kumulos.
     *
     * After being recorded locally, all stored events will be flushed to the server.
     *
     * @param {string} eventType - Identifier for the event category
     * @param {object} properties - Optional additional information about the event
     */
    trackEventImmediately: (eventType: string, properties?: {}) => void;
    /**
     * Updates the location of the current installation in Kumulos
     * Accurate locaiton information is used for geofencing
     * @param {object} location - the coordinates of the device
     */
    sendLocationUpdate: (location: {
        lat: number;
        lng: number;
    }) => void;
    /**
     * Associates a user identifier with the current Kumulos installation record.
     * @param {string} userIdentifier - the unique user ID
     * @param {object} attributes - optional attributes to set for the user (will overwrite any existing attributes)
     */
    associateUserWithInstall: (userIdentifier: string, attributes?: {}) => void;
    /**
     * Clears any current user association with this install record
     */
    clearUserAssociation: () => void;
    /**
     * Gets the currently associated user identifier
     * @returns {Promise<string>} - the currently user identifier, or the install ID if none associated
     */
    getCurrentUserIdentifier: () => Promise<string>;
    /**
     * Records a proximity event for an Eddystone beacon. Proximity events can be used in automation rules.
     * @param {object} beacon - eddystone beacon information
     */
    trackEddystoneBeaconProximity: (beacon: {
        namespaceHex: string;
        instanceHex: string;
        distanceMetres?: number;
    }) => void;
    /**
     * Records a proximity event for an iBeacon beacon. Proximity events can be used in automation rules.
     * @param {object} beacon - iBeacon beacon information
     */
    trackiBeaconProximity: (beacon: {
        uuid: string;
        major: number;
        minor: number;
        proximity?: number;
    }) => void;
    /**
     * Opts the user in or out of in-app messaging
     *
     * Note the configured consent strategy in SDK initialization must
     * be set to EXPLICIT_BY_USER otherwise this method throws a runtime
     * exception.
     */
    inAppUpdateConsentForUser: (consented: any) => void;
    /**
     * Gets a list of available in-app messages sent to the user and stored in the inbox
     */
    inAppGetInboxItems: () => Promise<InAppInboxItem[]>;
    /**
     * Presents the given in-app message to the user from the inbox
     */
    inAppPresentInboxMessage: (message: InAppInboxItem) => Promise<void>;
    /**
     * Presents the given in-app message to the user from the inbox
     */
    inAppDeleteMessageFromInbox: (message: InAppInboxItem) => Promise<void>;
    /**
     * Marks the given in-app inbox item as read
     */
    inAppMarkAsRead: (message: InAppInboxItem) => Promise<void>;
    /**
     * Marks all in-app inbox items as read
     */
    inAppMarkAllInboxItemsAsRead: () => Promise<void>;
    /**
     * Gets in-app inbox summary, which includes counts for total and unread messages.
     * Promise is rejected if operation fails.
     */
    inAppGetInboxSummary: () => Promise<InAppInboxSummary>;
    /**
     * Sets handler which is called when inbox is updated. This includes message marked as read, message opened, deleted, added, evicted or other.
     */
    setOnInboxUpdatedHandler: (handler: InboxUpdatedHandler) => void;
};
declare type InboxUpdatedHandler = () => void | null;
export default Kumulos;
