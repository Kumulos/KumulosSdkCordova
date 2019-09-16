# Kumulos Cordova SDK [![npm version](https://badge.fury.io/js/cordova-plugin-kumulos-sdk.svg)](https://www.npmjs.com/package/cordova-plugin-kumulos-sdk)

Kumulos provides tools to build and host backend storage for apps, send push notifications, view audience and behavior analytics, and report on adoption, engagement and performance.

## Prerequisites

-   iOS plugin installation requires [CocoaPods](https://cocoapods.org/) (`sudo gem install cocoapods`)
-   The plugin depends on Promises. Ensure you have a [suitable promise polyfill](https://github.com/stefanpenner/es6-promise) available in your app runtime [if required](https://caniuse.com/#search=Promise)

## Get Started with Cordova

```
cordova plugin add cordova-plugin-kumulos-sdk
```

Add https://*.kumulos.com to the `Content-Security-Policy` meta tag in your app, for example in `www/index.html`:

```html
<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:; connect-src 'self' https://*.kumulos.com;"
/>
```

Next You should create a `kumulos.json` file in your project root with Kumulos configuration:

```json
{
    "apiKey": "YOUR_API_KEY",
    "secretKey": "YOUR_SECRET_KEY",
    "enableCrashReporting": false,
    "inAppConsentStrategy": "in-app-disabled"
}
```

After creating the config file, complete initialization with:

```javascript
Kumulos.initialize({
    apiKey: 'YOUR_API_KEY',
    secretKey: 'YOUR_SECRET_KEY'
});
```

For more information on integrating the Cordova SDK with your project, please see the [Kumulos Cordova integration guide](https://docs.kumulos.com/integration/cordova).

## Get Started with Ionic

```
ionic cordova plugin add cordova-plugin-kumulos-sdk
```

Next, add the Kumulos type definitions to your `tsconfig.json` file:

```
{
...
  "files": [
    "node_modules/cordova-plugin-kumulos-sdk/index.d.ts"
  ],
...
}
```

Next You should create a `kumulos.json` file in your project root with Kumulos configuration:

```json
{
    "apiKey": "YOUR_API_KEY",
    "secretKey": "YOUR_SECRET_KEY",
    "enableCrashReporting": false,
    "inAppConsentStrategy": "in-app-disabled"
}
```

After creating the config file, complete initialization with:

```typescript
Kumulos.initialize({
    apiKey: 'YOUR_API_KEY',
    secretKey: 'YOUR_SECRET_KEY'
});
```

> N.B. You may need to add `connect-src 'self' https://*.kumulos.com;` to the `Content-Security-Policy` meta tag in your app in `www/index.html`

For more information on integrating the Cordova SDK with your project, please see the [Kumulos Cordova integration guide](https://docs.kumulos.com/integration/cordova).

## Contributing

Pull requests are welcome for any improvements you might wish to make. If it's something big and you're not sure about it yet, we'd be happy to discuss it first. You can either file an issue or drop us a line to [support@kumulos.com](mailto:support@kumulos.com).

## License

This project is licensed under the MIT license with portions licensed under the BSD 2-Clause license. See our LICENSE file and individual source files for more information.
