Kumulos provides an SDK in the form of a Cordova plugin to ease the integration of the Kumulos [App Build](https://docs.kumulos.com/build/overview), [Push Notification](https://docs.kumulos.com/push) and [Analytics](https://docs.kumulos.com/analytics) features into your hybrid app. This guide provides an overview of setting up the SDK for your project and sample usage.

The open-source Kumulos SDK is on Github [https://github.com/Kumulos/KumulosSdkCordova](https://github.com/Kumulos/KumulosSdkCordova) and currently supports hybrid apps on iOS and Android, allowing you to:

* Call API Methods - This feature takes HTTP url encoded form POST requests and returns API method responses in JSON.
* Upload Analytics - Upon instantiation, the Kumulos SDK will submit meta data about the current installation to the Kumulos server, including a generated unique installation ID.
* Receive push notifications - This feature provides methods to:
    * upload and store push tokens in Kumulos
    * remove push tokens from Kumulos
    * track opens in Kumulos

# Installation
The Kumulos SDK can be installed with the following command:
`cordova plugin add cordova-plugin-kumulos-sdk`

> N.B. The Kumulos Cordova plugin depends on Promises. Please ensure you have a [suitable promise polyfill](https://github.com/stefanpenner/es6-promise) available in your app runtime. Frameworks such as Ionic usually include a polyfill default.

# Initialization
The plugin defines global `window.kumulosSdk` object containing two properties:

* `Client` - the SDK core class. This is required to provide apiKey and secreteKey when instantiating the class.
* `getDeviceInfo()` - the method to get device information. This returns a device info object which has the following properties:
 * `iOSTokenType` - the iOS push token type (development, ad-hoc, app-store), required for registering for push notifications on iOS only.
 * `timeZone` - time zone in [IANA (Internet Assigned Numbers Authority)](https://www.iana.org/time-zones) format

Although in the global scope, `window.kumulosSdk` is not available until after the `deviceready` event and this must be initialized before calling its methods. Please see the example below.   

```language-javascript
var kumulosClient

initializeSdk().then(function (client) {
    kumulosClient = client;
    console.log('Service initialized')
})

function initializeSdk() {
    return new Promise(function (resolve, reject) {
        document.addEventListener('deviceready', function () {
            var apiKey = 'XXXXXXXXXXXXXXXXXXXXXXXX';
            var secretKey = 'XXXXXXXXXXXX';
            var kumulosClient = new window.kumulosSdk.Client(apiKey, secretKey);
            resolve(kumulosClient);
        }, false);
    });
};
```

Your API Key and Secret Key can be obtained from your [App Dashboard](https://docs.kumulos.com/apps/#the-app-dashboard) in your agency console.

The first time the Client object is initialized, a unique installation ID is generated and stored in a file located in a persistent and private data directory on the device. This is then uploaded to Kumulos along with other metadata for the app (e.g. version) and the device (e.g. platform, os version etc) for use in analtyics. The unique installation ID will then be retrieved from the persistent storage each time the client object is initialized for sending metadata and push tokens to Kumulos.

# Calling API Methods

Example code to make an API call is shown below:

```language-javascript
var params = {}
params.Name = $('#name').val()
params.Email = $('#email').val()
params.Password = $('#password').val()

kumulosClient.call('createCustomer', params)
```

# Push Notifications

To receive and handle native push notifications, it is recommend to use [Phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push).

The following example shows how to upload push token to Kumulos and then track opens using Phonegap-plugin-push.

```language-javascript   
var senderId = 'XXXXXXXXXXXX';

var push = window.PushNotification.init({
    android: {
        senderID: senderId,
        sound: true,
        forceShow: true
    },
    ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true'
    }
})

push.on('registration', function (data) {
    kumulosClient.pushStoreToken(data.registrationId).then(function(response) {
        console.log(response.status);
    })
})

push.on('error', function(e) {
        console.log(e);
});

push.on('notification', function (data) {
    var id = data.additionalData.custom.i;
    kumulosClient.pushTrackOpen(id).then(function(response) {
        console.log(response.status);
    })
})
```

To remove the token from Kumulos server, please see the example below.
```
kumulosClient.pushRemoveToken().then(function(response) {
    console.log(response.status);
}
```

# Contributing

Pull requests are welcome for any improvements you might wish to make. If it's something big and you're not sure about it yet, we'd be happy to discuss it first. You can either file an issue or drop us a line at [support@kumulos.com](mailto:support@kumulos.com).

# License

This project is licensed under the MIT license with portions licensed under the BSD 2-Clause license. See our LICENSE file and individual source files for more information.

