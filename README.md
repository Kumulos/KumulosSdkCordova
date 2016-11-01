# cordova-plugin-kumulos-sdk
The plugin implements a Kumulos SDK library allowing API calls, installation tracking and push notification powerd by Kumulos server.  

The SDK provides the following APIs 
* Kumulos API call:  This service takes HTTP urlencoded form POST requests and returns the API method responses as JSON format. 
* Installation tracking: Upon instantiation, the Kumulos SDK will submit meta data about the current installation to the Kumulos server, including a generated unique installation ID.
* Push notification: This service provides methods to 
 * store push notification token on Kumulos server
 * remove push notification token from Kumulos server
 * track push notification messages on Kumulos server

## Installation
`cordova plugin add cordova-plugin-kumulos-sdk`

## Supported Platforms
* Andriod
* iOS

## Initialization of SDK
The plugin defines global `window.kumulosSdk` object. 
There are two properties of the object window.kumulosSdk.
* Client: the SDK core class. It is required to provide apiKey and secreteKey when instantiating the class. 
* getDeviceInfo: the library to get device information. It returns a device info object which has the properties:
 * iOSTokenType: iOS push token type (development, ad-hoc, app-store). iOSTokenType is only required on iOS platform and needed in registering Push Notification;
 * timeZone: time zone in  IANA (Internet Assigned Numbers Authority) format

Although in the global scope, `window.kumulosSdk` is not available until after the `deviceready` event. The appService needs to be initialised before calling its methods. Please see the example below.   

```
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

API Key and Secret Key can be obtained from the Kumulos application portal. 

In the initialization of Client object, the installation information of the mobile app including an installation ID will be collected and sent to Kumulos server. 
The installation ID is stored in a file which is located in a persistent and private data directory on device. The ID is generated and stored when initializing the Client object. It will be used when sending installation information and push notification. 

## API calls

The example to make an API call is shown as below.

```
var params = {}
params.Name = $('#name').val()
params.Email = $('#email').val()
params.Password = $('#password').val()

kumulosClient.call('createCustomer', params)
```

## Push Notification 

To receive and handle native push notifications, it is recommend to use [Phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push). 

The following example will show you how to store push notification token to Kumulos server and track notifications using Phonegap-plugin-push. 

```   
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
## Contributing

Pull requests are welcome for any improvements you might wish to make. If it's something big and you're not sure about it yet, we'd be happy to discuss it first. You can either file an issue or drop us a line to [support@kumulos.com](mailto:support@kumulos.com).

## License

This project is licensed under the MIT license with portions licensed under the BSD 2-Clause license. See our LICENSE file and individual source files for more information.


