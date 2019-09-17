interface PushChannel {
    uuid: string;
    name?: string;
    subscribed: Boolean;
    meta?: any;
}

interface ChannelSpec {
    uuid: string;
    subscribe: boolean;
    meta?: any;
    name?: string;
    showInPortal?: boolean;
}

interface PushNotification {
    id: number;
    title?: string | null;
    message?: string | null;
    data?: {
        [key: string]: any;
    } | null;
    url?: string | null;
}

interface PushChannelManager {
    /**
     * Subscribes to the channels given by unique ID
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

interface KumulosConfig {
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

interface KumulosSdk {
    /**
     * Used to configure the Kumulos class. Only needs to be called once per process
     */
    initialize: (config: KumulosConfig) => void;

    /**
     * Get the Kumulos installation ID
     */
    getInstallId: () => Promise<string>;

    /**
     * Make an RPC call to a Backend API method
     */
    call: <T>(methodName: string, params?: {}) => Promise<T>;

    /**
     * Get the channel subscription manager
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
    inAppGetInboxItems: () => Promise<InAppInboxItem>;

    /**
     * Presents the given in-app message to the user from the inbox
     */
    inAppPresentInboxMessage: (message: InAppInboxItem) => Promise<void>;

    /**
     * Tracks a custom analytics event with Kumulos.
     *
     * Events are persisted locally and synced to the server in the background in batches.
     */
    trackEvent: (eventType: string, properties?: {}) => void;

    /**
     * Tracks a custom analytics event with Kumulos.
     *
     * After being recorded locally, all stored events will be flushed to the server.
     */
    trackEventImmediately: (eventType: string, properties?: {}) => void;

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
     * Updates the location of the current installation in Kumulos
     * Accurate location information is used for geofencing
     */
    sendLocationUpdate: (location: { lat: number; lng: number }) => void;

    /**
     * Associates a user identifier with the current Kumulos installation record.
     *
     * If attributes are provided, will also set attributes for this user
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
     */
    trackEddystoneBeaconProximity: (beacon: {
        namespaceHex: string;
        instanceHex: string;
        distanceMetres?: number;
    }) => void;

    /**
     * Records a proximity event for an iBeacon beacon. Proximity events can be used in automation rules.
     */
    trackiBeaconProximity: (beacon: {
        uuid: string;
        major: number;
        minor: number;
        proximity?: number;
    }) => void;
}

declare const Kumulos: KumulosSdk;
