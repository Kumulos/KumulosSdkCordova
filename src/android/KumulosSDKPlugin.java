package com.kumulos.cordova.android;

import android.app.Application;
import android.location.Location;

import com.kumulos.android.InAppInboxItem;
import com.kumulos.android.Installation;
import com.kumulos.android.Kumulos;
import com.kumulos.android.KumulosConfig;
import com.kumulos.android.KumulosInApp;
import com.kumulos.android.KumulosInApp.InboxMessagePresentationResult;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public class KumulosSDKPlugin extends CordovaPlugin {

    private static final String ACTION_INIT = "initBaseSdk";
    private static final String ACTION_GET_INSTALL_ID = "getInstallId";
    private static final String ACTION_TRACK_EVENT = "trackEvent";
    private static final String ACTION_SEND_LOCATION_UPDATE = "sendLocationUpdate";
    private static final String ACTION_ASSOCIATE_USER = "associateUserWithInstall";
    private static final String ACTION_CLEAR_USER_ASSOCIATION = "clearUserAssociation";
    private static final String ACTION_GET_CURRENT_USER_ID = "getCurrentUserId";
    private static final String ACTION_PUSH_REGISTER = "pushRegister";
    private static final String ACTION_PUSH_UNREGISTER = "pushUnregister";
    private static final String ACTION_IN_APP_UPDATE_CONSENT = "inAppUpdateUserConsent";
    private static final String ACTION_IN_APP_GET_INBOX_ITEMS = "inAppGetInboxItems";
    private static final String ACTION_IN_APP_PRESENT_INBOX_MESSAGE = "inAppPresentInboxMessage";

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
            case ACTION_CLEAR_USER_ASSOCIATION:
                this.clearUserAssociation(args, callbackContext);
                return true;
            case ACTION_GET_CURRENT_USER_ID:
                this.getCurrentUserId(args, callbackContext);
                return true;
            case ACTION_PUSH_REGISTER:
                this.pushRegUnreg(callbackContext, true);
                return true;
            case ACTION_PUSH_UNREGISTER:
                this.pushRegUnreg(callbackContext, false);
                return true;
            case ACTION_IN_APP_UPDATE_CONSENT:
                this.inAppUpdateConsent(args, callbackContext);
                return true;
            case ACTION_IN_APP_GET_INBOX_ITEMS:
                this.inAppGetInboxItems(callbackContext);
                return true;
            case ACTION_IN_APP_PRESENT_INBOX_MESSAGE:
                this.inAppPresentInboxMessage(args, callbackContext);
                return true;
            default:
                return false;
        }
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

    private void clearUserAssociation(JSONArray args, CallbackContext callbackContext) {
        Kumulos.clearUserAssociation(this.cordova.getContext());
        callbackContext.success();
    }

    private void getCurrentUserId(JSONArray args, CallbackContext callbackContext) {
        String userId = Kumulos.getCurrentUserIdentifier(this.cordova.getContext());
        callbackContext.success(userId);
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

    private void pushRegUnreg(CallbackContext callbackContext, boolean register) {
        if (register) {
            Kumulos.pushRegister(this.cordova.getContext());
        } else {
            Kumulos.pushUnregister(this.cordova.getContext());
        }

        callbackContext.success();
    }

    private void inAppUpdateConsent(JSONArray args, CallbackContext callbackContext) {
        final boolean consented;

        try {
            consented = args.getBoolean(0);
        } catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(e.getMessage());
            return;
        }

        KumulosInApp.updateConsentForUser(consented);
        callbackContext.success();
    }

    private void inAppGetInboxItems(CallbackContext callbackContext) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        List<InAppInboxItem> items = KumulosInApp.getInboxItems(cordova.getContext());
        JSONArray results = new JSONArray();
        try {
            for (InAppInboxItem item : items) {
                JSONObject mapped = new JSONObject();

                mapped.put("id", item.getId());
                mapped.put("title", item.getTitle());
                mapped.put("subtitle", item.getSubtitle());

                Date availableFrom = item.getAvailableFrom();
                Date availableTo = item.getAvailableTo();
                Date dismissedAt = item.getDismissedAt();

                if (null == availableFrom) {
                    mapped.put("availableFrom", "");
                } else {
                    mapped.put("availableFrom", formatter.format(availableFrom));
                }

                if (null == availableTo) {
                    mapped.put("availableTo", "");
                } else {
                    mapped.put("availableTo", formatter.format(availableTo));
                }

                if (null == dismissedAt) {
                    mapped.put("dismissedAt", "");
                } else {
                    mapped.put("dismissedAt", formatter.format(dismissedAt));
                }

                results.put(mapped);
            }
        } catch(JSONException e){
            e.printStackTrace();
            callbackContext.error(e.getMessage());
        }

        callbackContext.success(results);
    }

    private void inAppPresentInboxMessage(JSONArray args, CallbackContext callbackContext) {
        int messageId = args.optInt(0, -1);

        if (messageId == -1) {
            callbackContext.error("Message not found or not available");
            return;
        }

        List<InAppInboxItem> items = KumulosInApp.getInboxItems(this.cordova.getContext());
        for (InAppInboxItem item : items) {
            if (item.getId() == messageId) {
                InboxMessagePresentationResult result = KumulosInApp.presentInboxMessage(cordova.getContext(), item);

                if (result == InboxMessagePresentationResult.PRESENTED) {
                    callbackContext.success();
                } else {
                    break;
                }
            }
        }

        callbackContext.error("Message not found or not available");
    }

}
