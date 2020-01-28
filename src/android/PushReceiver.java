package com.kumulos.cordova.android;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import com.kumulos.android.Kumulos;
import com.kumulos.android.PushBroadcastReceiver;
import com.kumulos.android.PushMessage;

import org.json.JSONException;
import org.json.JSONObject;
import com.kumulos.android.PushActionHandlerInterface;

public class PushReceiver extends PushBroadcastReceiver {

    static JSONObject pushMessageToJsonObject(PushMessage pushMessage, String actionId) {
        JSONObject message = new JSONObject();

        try {
            message.put("id", pushMessage.getId());
            message.put("title", pushMessage.getTitle());
            message.put("message", pushMessage.getMessage());

            if (null != pushMessage.getUrl()) {
                message.put("url", pushMessage.getUrl().toString());
            }

            if (actionId != null){
                 message.put("actionId", actionId);
            }

            String pictureUrl = pushMessage.getPictureUrl();
            if (pictureUrl != null){
                message.put("pictureUrl", pictureUrl);
            }

            message.put("data", pushMessage.getData());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return message;
    }

    @Override
    protected void onPushReceived(Context context, PushMessage pushMessage) {
        super.onPushReceived(context, pushMessage);

        KumulosSDKPlugin.sendMessageToJs("pushReceived", pushMessageToJsonObject(pushMessage, null));
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void onPushOpened(Context context, PushMessage pushMessage) {
        try {
            Kumulos.pushTrackOpen(context, pushMessage.getId());
        } catch (Kumulos.UninitializedException e) {
            /* Noop */
        }

        PushReceiver.handlePushOpen(context, pushMessage, null);
    }

    private static void handlePushOpen(Context context, PushMessage pushMessage, String actionId){
        PushReceiver pr = new PushReceiver();
        Intent launchIntent = pr.getPushOpenActivityIntent(context, pushMessage);

        if (null == launchIntent) {
            return;
        }

        ComponentName component = launchIntent.getComponent();
        if (null == component) {
            return;
        }

        Class<? extends Activity> cls = null;
        try {
            cls = (Class<? extends Activity>) Class.forName(component.getClassName());
        } catch (ClassNotFoundException e) {
            /* Noop */
        }

        // Ensure we're trying to launch an Activity
        if (null == cls) {
            return;
        }

        if (null != pushMessage.getUrl()) {
            launchIntent = new Intent(Intent.ACTION_VIEW, pushMessage.getUrl());
        }

        launchIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        addDeepLinkExtras(pushMessage, launchIntent);

        if (KumulosSDKPlugin.sCordova != null){
            Intent existingIntent = KumulosSDKPlugin.sCordova.getActivity().getIntent();
            addDeepLinkExtras(pushMessage, existingIntent);
        }

        context.startActivity(launchIntent);

        if (null == KumulosSDKPlugin.jsCallbackContext) {
            KumulosSDKPlugin.pendingPush = pushMessage;
            KumulosSDKPlugin.pendingActionId = actionId;
            return;
        }

        KumulosSDKPlugin.sendMessageToJs("pushOpened", pushMessageToJsonObject(pushMessage, actionId));
    }

    static class PushActionHandler implements PushActionHandlerInterface {
        @Override
        public void handle(Context context, PushMessage pushMessage, String actionId) {
            PushReceiver.handlePushOpen(context, pushMessage, actionId);

            Intent it = new Intent(Intent.ACTION_CLOSE_SYSTEM_DIALOGS);
            context.sendBroadcast(it);
        }
    }
}
