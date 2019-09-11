package com.kumulos.cordova.android;

import android.content.Context;
import android.util.Log;

import com.kumulos.android.PushBroadcastReceiver;
import com.kumulos.android.PushMessage;

public class PushReceiver extends PushBroadcastReceiver {

    @Override
    protected void onPushReceived(Context context, PushMessage pushMessage) {
        super.onPushReceived(context, pushMessage);

        Log.i("KUM-CDV", "onPushReceived");
    }

    @Override
    protected void onPushOpened(Context context, PushMessage pushMessage) {
        super.onPushOpened(context, pushMessage);

        Log.i("KUM-CDV", "onPushOpened");
    }
}
