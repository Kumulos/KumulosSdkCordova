import { PushChannelManager } from './push';
export interface KumulosConfig {
    apiKey: string;
    secretKey: string;
    enableCrashReporting?: boolean;
}
declare const Kumulos: {
    initialize: (config: KumulosConfig) => void;
    getInstallId: () => Promise<string>;
    recordException: (err: any) => void;
    call: <T>(methodName: string, params?: {}) => Promise<T>;
    getPushSubscriptionManager: () => PushChannelManager;
    pushRemoveToken: () => Promise<Response>;
    pushStoreToken: (token: string) => void;
    pushTrackOpen: (notificationId: string) => void;
    trackEvent: (eventType: string, properties?: {}) => void;
    trackEventImmediately: (eventType: string, properties?: {}) => void;
    sendLocationUpdate: (location: {
        lat: number;
        lng: number;
    }) => void;
    associateUserWithInstall: (userIdentifier: string) => void;
    trackEddystoneBeaconProximity: (beacon: {
        namespaceHex: string;
        instanceHex: string;
        distanceMetres?: number;
    }) => void;
    trackiBeaconProximity: (beacon: {
        uuid: string;
        major: number;
        minor: number;
        proximity?: number;
    }) => void;
};
export default Kumulos;
