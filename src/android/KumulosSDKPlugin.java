package com.kumulos.cordova.android;

import org.apache.cordova.CordovaPlugin;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.TimeZone;

public class KumulosSDKPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("getDeviceInfo")) {
            this.getDeviceInfo(callbackContext);
            return true;
        }
        return false;
    }

    private void getDeviceInfo(CallbackContext callbackContext) {
        JSONObject result = new JSONObject();
        try {
            result.put("timeZone", TimeZone.getDefault().getID());
            callbackContext.success(result);
        } catch (JSONException e) {
            callbackContext.error(e.getMessage());
        }
    }
}
