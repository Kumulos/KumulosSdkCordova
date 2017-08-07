# Kumulos Cordova SDK [![npm version](https://badge.fury.io/js/cordova-plugin-kumulos-sdk.svg)](https://www.npmjs.com/package/cordova-plugin-kumulos-sdk)

Kumulos provides tools to build and host backend storage for apps, send push notifications, view audience and behavior analytics, and report on adoption, engagement and performance.

## Get Started with Cordova

```
cordova plugin add cordova-plugin-kumulos-sdk
```

> N.B. The Kumulos Cordova plugin depends on Promises. Please ensure you have a [suitable promise polyfill](https://github.com/stefanpenner/es6-promise) available in your app runtime.

After installation, you can now initialize the SDK with:

```javascript
var client = new kumulosSdk.Client("YOUR_API_KEY", "YOUR_SECRET_KEY");
```

For more information on integrating the Cordova SDK with your project, please see the [Kumulos Cordova integration guide](https://docs.kumulos.com/integration/cordova).

## Get Started with Ionic

```
ionic cordova plugin add cordova-plugin-kumulos-sdk
```

After installation, you can now initialize the SDK with:

```typescript
var client = new kumulosSdk.Client("YOUR_API_KEY", "YOUR_SECRET_KEY");
```

For more information on integrating the Cordova SDK with your project, please see the [Kumulos Cordova integration guide](https://docs.kumulos.com/integration/cordova).

## Contributing

Pull requests are welcome for any improvements you might wish to make. If it's something big and you're not sure about it yet, we'd be happy to discuss it first. You can either file an issue or drop us a line to [support@kumulos.com](mailto:support@kumulos.com).

## License

This project is licensed under the MIT license with portions licensed under the BSD 2-Clause license. See our LICENSE file and individual source files for more information.
