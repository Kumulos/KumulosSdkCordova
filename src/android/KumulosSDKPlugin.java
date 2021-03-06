package com.kumulos.cordova.android;

import android.content.Context;
import android.location.Location;
import androidx.annotation.Nullable;

import com.kumulos.android.InAppDeepLinkHandlerInterface;
import com.kumulos.android.InAppInboxItem;
import com.kumulos.android.Installation;
import com.kumulos.android.Kumulos;
import com.kumulos.android.KumulosInApp;
import com.kumulos.android.KumulosInApp.InboxMessagePresentationResult;
import com.kumulos.android.PushMessage;
import com.kumulos.android.InAppInboxSummary;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.net.URL;

public class KumulosSDKPlugin extends CordovaPlugin {

    @Nullable
    static CallbackContext jsCallbackContext;
    @Nullable
    static PushMessage pendingPush;
    @Nullable
    static String pendingActionId;

    static CordovaInterface sCordova;

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
    private static final String ACTION_IN_APP_DELETE_INBOX_MESSAGE = "inAppDeleteMessageFromInbox";
    private static final String ACTION_IN_APP_MARK_INBOX_ITEM_READ = "inAppMarkAsRead";
    private static final String ACTION_IN_APP_MARK_ALL_INBOX_ITEMS_READ = "inAppMarkAllInboxItemsAsRead";
    private static final String ACTION_IN_APP_GET_INBOX_SUMMARY = "inAppGetInboxSummary";

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        sCordova = cordova;
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        switch (action) {
            case ACTION_INIT:
                this.initBaseSdk(callbackContext);
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
                this.clearUserAssociation(callbackContext);
                return true;
            case ACTION_GET_CURRENT_USER_ID:
                this.getCurrentUserId(callbackContext);
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
                cordova.getThreadPool().execute(() -> KumulosSDKPlugin.this.inAppGetInboxItems(callbackContext));
                return true;
            case ACTION_IN_APP_PRESENT_INBOX_MESSAGE:
                cordova.getThreadPool().execute(() ->KumulosSDKPlugin.this.inAppPresentInboxMessage(args, callbackContext));
                return true;
            case ACTION_IN_APP_DELETE_INBOX_MESSAGE:
                cordova.getThreadPool().execute(() ->KumulosSDKPlugin.this.inAppDeleteMessageFromInbox(args, callbackContext));
                return true;
            case ACTION_IN_APP_MARK_INBOX_ITEM_READ:
                cordova.getThreadPool().execute(() -> KumulosSDKPlugin.this.inAppMarkInboxItemRead(args, callbackContext));
                return true;
            case ACTION_IN_APP_MARK_ALL_INBOX_ITEMS_READ:
                cordova.getThreadPool().execute(() -> KumulosSDKPlugin.this.inAppMarkAllInboxItemsRead(callbackContext));
                return true;
            case ACTION_IN_APP_GET_INBOX_SUMMARY:
                this.inAppGetInboxSummary(callbackContext);
                return true;
            default:
                return false;
        }
    }

    static boolean sendMessageToJs(String type, JSONObject data) {
        if (null == jsCallbackContext) {
            return false;
        }

        JSONObject message = new JSONObject();
        try {
            message.put("type", type);
            message.put("data", data);
        }  catch (JSONException e) {
            e.printStackTrace();
            return false;
        }

        PluginResult result = new PluginResult(PluginResult.Status.OK, message);
        result.setKeepCallback(true);
        jsCallbackContext.sendPluginResult(result);

        return true;
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

    private void clearUserAssociation(CallbackContext callbackContext) {
        Kumulos.clearUserAssociation(this.cordova.getContext());
        callbackContext.success();
    }

    private void getCurrentUserId(CallbackContext callbackContext) {
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

    private void initBaseSdk(CallbackContext callbackContext) {
        jsCallbackContext = callbackContext;
        PluginResult result = new PluginResult(PluginResult.Status.OK);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);

        if (null != pendingPush) {
            KumulosSDKPlugin.sendMessageToJs("pushOpened", PushReceiver.pushMessageToJsonObject(pendingPush, pendingActionId));
            pendingPush = null;
            pendingActionId = null;
        }
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
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));

        List<InAppInboxItem> items = KumulosInApp.getInboxItems(cordova.getContext());
        JSONArray results = new JSONArray();
        try {
            for (InAppInboxItem item : items) {
                JSONObject mapped = new JSONObject();

                mapped.put("id", item.getId());
                mapped.put("title", item.getTitle());
                mapped.put("subtitle", item.getSubtitle());
                mapped.put("isRead", item.isRead());
                mapped.put("sentAt", formatter.format(item.getSentAt()));

                Date availableFrom = item.getAvailableFrom();
                Date availableTo = item.getAvailableTo();
                Date dismissedAt = item.getDismissedAt();
                mapped.put("data", item.getData());

                URL imageUrl = item.getImageUrl();
                mapped.put("imageUrl", imageUrl == null ? null : imageUrl.toString());

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
                    return;
                } else {
                    break;
                }
            }
        }

        callbackContext.error("Message not found or not available");
    }

    private void inAppDeleteMessageFromInbox(JSONArray args, CallbackContext callbackContext) {
        int messageId = args.optInt(0, -1);

        if (messageId == -1) {
            callbackContext.error("Message not found or not available");
            return;
        }

        List<InAppInboxItem> items = KumulosInApp.getInboxItems(this.cordova.getContext());
        for (InAppInboxItem item : items) {
            if (item.getId() == messageId) {
                boolean result = KumulosInApp.deleteMessageFromInbox(cordova.getContext(), item);

                if (result) {
                    callbackContext.success();
                    return;
                }

                break;
            }
        }

        callbackContext.error("Message not found or not available");
    }

    private void inAppMarkInboxItemRead(JSONArray args, CallbackContext callbackContext) {
        int messageId = args.optInt(0, -1);

        if (messageId == -1) {
            callbackContext.error("Message not found or not available");
            return;
        }

        List<InAppInboxItem> items = KumulosInApp.getInboxItems(this.cordova.getContext());
        for (InAppInboxItem item : items) {
            if (item.getId() == messageId) {
                boolean result = KumulosInApp.markAsRead(cordova.getContext(), item);

                if (result) {
                    callbackContext.success();
                }
                else{
                    callbackContext.error("Failed to mark message as read");
                }
                return;
            }
        }

        callbackContext.error("Message not found or not available");
    }

    private void inAppMarkAllInboxItemsRead(CallbackContext callbackContext) {
        boolean result = KumulosInApp.markAllInboxItemsAsRead(cordova.getContext());
        if (result) {
            callbackContext.success();
        }
        else {
            callbackContext.error("Failed to mark all messages as read");
        }
    }

    private void inAppGetInboxSummary(CallbackContext callbackContext) {
        KumulosInApp.getInboxSummaryAsync(cordova.getContext(), (InAppInboxSummary summary) -> {
            if (summary == null){
                callbackContext.error("Could not get inbox summary");
                return;
            }

            try {
                JSONObject res = new JSONObject();
                res.put("totalCount", summary.getTotalCount());
                res.put("unreadCount", summary.getUnreadCount());
                callbackContext.success(res);
            } catch(JSONException e){
                e.printStackTrace();
                callbackContext.error(e.getMessage());
            }
        });
    }

    static class InAppDeepLinkHandler implements InAppDeepLinkHandlerInterface {

        @Override
        public void handle(Context context, JSONObject data) {
            sendMessageToJs("inAppDeepLinkPressed", data);
        }
    }

    static class InboxUpdatedHandler implements KumulosInApp.InAppInboxUpdatedHandler {
        @Override
        public void run() {
           sendMessageToJs("inAppInboxUpdated", null);
        }
    }
}
