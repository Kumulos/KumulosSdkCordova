var exec = require('cordova/exec'),
    core = require('./KumulosSDKCore'),
    argscheck = require('cordova/argscheck');

var KumulosSDK = {
    getDeviceInfo: function (success, error) {
        argscheck.checkArgs('fF', 'KumulosSDK.getDeviceInfo', arguments);
        exec(success, error, "KumulosSDKPlugin", "getDeviceInfo", []);
    },
    Client: core.Client
}

module.exports = KumulosSDK;