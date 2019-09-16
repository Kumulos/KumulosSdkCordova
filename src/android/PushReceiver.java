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

public class PushReceiver extends PushBroadcastReceiver {

    static JSONObject pushMessageToJsonObject(PushMessage pushMessage) {
        JSONObject message = new JSONObject();

        try {
            message.put("id", pushMessage.getId());
            message.put("title", pushMessage.getTitle());
            message.put("message", pushMessage.getMessage());

            if (null != pushMessage.getUrl()) {
                message.put("url", pushMessage.getUrl().toString());
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

        KumulosSDKPlugin.sendMessageToJs("pushReceived", pushMessageToJsonObject(pushMessage));
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void onPushOpened(Context context, PushMessage pushMessage) {
        try {
            Kumulos.pushTrackOpen(context, pushMessage.getId());
        } catch (Kumulos.UninitializedException e) {
            /* Noop */
        }

        Intent launchIntent = getPushOpenActivityIntent(context, pushMessage);

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

        Intent existingIntent = KumulosSDKPlugin.sCordova.getActivity().getIntent();
        addDeepLinkExtras(pushMessage, existingIntent);

        context.startActivity(launchIntent);

        if (null == KumulosSDKPlugin.jsCallbackContext) {
            KumulosSDKPlugin.pendingPush = pushMessage;
            return;
        }

        KumulosSDKPlugin.sendMessageToJs("pushOpened", pushMessageToJsonObject(pushMessage));
    }


}
