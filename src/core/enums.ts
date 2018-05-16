export enum ResponseCode {
    SUCCESS = 1,
    NOT_AUTHORIZED = 2,
    NO_SUCH_METHOD = 4,
    NO_SUCH_FORMAT = 8,
    ACCOUNT_SUSPENDED = 16,
    INVALID_REQUEST = 32,
    UNKNOWN_SERVER_ERROR = 64,
    DATABASE_ERROR = 128
}

export const PushBaseUrl = `https://push.kumulos.com`;

export const ClientBaseUrl = `https://api.kumulos.com`;
