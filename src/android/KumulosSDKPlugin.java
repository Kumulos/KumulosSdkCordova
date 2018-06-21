package com.kumulos.cordova.android;

import android.app.Application;
import android.location.Location;

import com.kumulos.android.Installation;
import com.kumulos.android.Kumulos;
import com.kumulos.android.KumulosConfig;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class KumulosSDKPlugin extends CordovaPlugin {

    private static final String ACTION_INIT = "initBaseSdk";
    private static final String ACTION_GET_INSTALL_ID = "getInstallId";
    private static final String ACTION_TRACK_EVENT = "trackEvent";
    private static final String ACTION_SEND_LOCATION_UPDATE = "sendLocationUpdate";
    private static final String ACTION_ASSOCIATE_USER = "associateUserWithInstall";
    private static final String ACTION_PUSH_STORE_TOKEN = "pushStoreToken";

    private static final String EVENT_TYPE_PUSH_DEVICE_REGISTERED = "k.push.deviceRegistered";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case ACTION_INIT:
                this.initBaseSdk(args, callbackContext);
                return true;
            case ACTION_GET_INSTALL_ID:
                this.getInstallId(callbackContext);
                return true;
            case ACTION_TRACK_EVENT:
                this.trackEvent(args, callbackContext);
                return true;
            case ACTION_SEND_LOCATION_UPDATE:
                this.sendLocationUpdate(args, callbackContext);
                return true;
            case ACTION_ASSOCIATE_USER:
                this.associateUser(args, callbackContext);
                return true;
            case ACTION_PUSH_STORE_TOKEN:
                this.pushStoreToken(args, callbackContext);
                return true;
            default:
                return false;
        }
    }

    private void pushStoreToken(JSONArray args, CallbackContext callbackContext) {
        JSONObject props = new JSONObject();

        try {
            props.put("type", 2);
            props.put("token", args.getString(0));
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        Kumulos.trackEventImmediately(this.cordova.getContext(), EVENT_TYPE_PUSH_DEVICE_REGISTERED, props);

        callbackContext.success();
    }

    private void associateUser(JSONArray args, CallbackContext callbackContext) {
        String userId;
        JSONObject attributes;

        try {
            userId = args.getString(0);
            attributes = args.optJSONObject(1);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        if (null == attributes) {
            Kumulos.associateUserWithInstall(this.cordova.getContext(), userId);
        }
        else {
            Kumulos.associateUserWithInstall(this.cordova.getContext(), userId, attributes);
        }

        callbackContext.success();
    }

    private void sendLocationUpdate(JSONArray args, CallbackContext callbackContext) {
        Location location = new Location("");

        try {
            location.setLatitude(args.getDouble(0));
            location.setLongitude(args.getDouble(1));
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        Kumulos.sendLocationUpdate(this.cordova.getContext(), location);

        callbackContext.success();
    }

    private void trackEvent(JSONArray args, CallbackContext callbackContext) {
        String eventType;
        JSONObject props;
        boolean immediateFlush;

        try {
            eventType = args.getString(0);
            props = args.optJSONObject(1);
            immediateFlush = args.getBoolean(2);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        if (immediateFlush) {
            Kumulos.trackEventImmediately(this.cordova.getContext(), eventType, props);
        }
        else {
            Kumulos.trackEvent(this.cordova.getContext(), eventType, props);
        }

        callbackContext.success();
    }

    private void initBaseSdk(JSONArray args, CallbackContext callbackContext) {
        final String apiKey;
        final String secretKey;
        final boolean enableCrashReporting;
        final JSONObject sdkInfo;
        final JSONObject runtimeInfo;

        try {
            apiKey = args.getString(0);
            secretKey = args.getString(1);
            enableCrashReporting = args.getBoolean(2);
            sdkInfo = args.getJSONObject(3);
            runtimeInfo = args.getJSONObject(4);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        KumulosConfig.Builder configBuilder = new KumulosConfig.Builder(apiKey, secretKey);

        if (enableCrashReporting) {
            configBuilder.enableCrashReporting();
        }

        configBuilder.setSdkInfo(sdkInfo);
        configBuilder.setRuntimeInfo(runtimeInfo);

        Application application = this.cordova.getActivity().getApplication();
        KumulosConfig config = configBuilder.build();

        Kumulos.initialize(application, config);

        callbackContext.success();
    }

    private void getInstallId(CallbackContext callbackContext) {
        String id = Installation.id(this.cordova.getContext());
        callbackContext.success(id);
    }

}
