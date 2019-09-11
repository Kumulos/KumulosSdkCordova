package com.kumulos.cordova.android;

import android.app.Application;
import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.res.Resources;
import android.database.Cursor;
import android.net.Uri;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.kumulos.android.Kumulos;
import com.kumulos.android.KumulosConfig;

public class KumulosInitProvider extends ContentProvider {

    private static final String KEY_API_KEY = "kumulos_api_key";
    private static final String KEY_SECRET_KEY = "kumulos_secret_key";
    private static final String KEY_ENABLE_CRASH_REPORTING = "kumulos_enable_crash_reporting";
    private static final String KEY_IN_APP_CONSENT_STRATEGY = "kumulos_in_app_consent_strategy";
    private static final String IN_APP_AUTO_ENROLL = "auto-enroll";
    private static final String IN_APP_EXPLICIT_BY_USER = "explicit-by-user";

    @Override
    public boolean onCreate() {
        Application application = (Application) getContext().getApplicationContext();

        String packageName = application.getPackageName();
        Resources resources = application.getResources();

        String apiKey = getStringConfigValue(packageName, resources, KEY_API_KEY);
        String secretKey = getStringConfigValue(packageName, resources, KEY_SECRET_KEY);

        if (TextUtils.isEmpty(apiKey) || TextUtils.isEmpty(secretKey)) {
            return true;
        }

        boolean enableCrashReporting = getBooleanConfigValue(packageName, resources, KEY_ENABLE_CRASH_REPORTING);
        String inAppConsentStrategy = getStringConfigValue(packageName, resources, KEY_IN_APP_CONSENT_STRATEGY);

        assert apiKey != null;
        assert secretKey != null;
        KumulosConfig.Builder config = new KumulosConfig.Builder(apiKey, secretKey);

        if (enableCrashReporting) {
            config.enableCrashReporting();
        }

        if (IN_APP_AUTO_ENROLL.equals(inAppConsentStrategy)) {
            config.enableInAppMessaging(KumulosConfig.InAppConsentStrategy.AUTO_ENROLL);
        } else if (IN_APP_EXPLICIT_BY_USER.equals(inAppConsentStrategy)) {
            config.enableInAppMessaging(KumulosConfig.InAppConsentStrategy.EXPLICIT_BY_USER);
        }

        Kumulos.initialize(application, config.build());

        return true;
    }

    @Nullable
    @Override
    public Cursor query(@NonNull Uri uri, @Nullable String[] projection, @Nullable String selection, @Nullable String[] selectionArgs, @Nullable String sortOrder) {
        return null;
    }

    @Nullable
    @Override
    public String getType(@NonNull Uri uri) {
        return null;
    }

    @Nullable
    @Override
    public Uri insert(@NonNull Uri uri, @Nullable ContentValues values) {
        return null;
    }

    @Override
    public int delete(@NonNull Uri uri, @Nullable String selection, @Nullable String[] selectionArgs) {
        return 0;
    }

    @Override
    public int update(@NonNull Uri uri, @Nullable ContentValues values, @Nullable String selection, @Nullable String[] selectionArgs) {
        return 0;
    }

    @Nullable
    private String getStringConfigValue(String packageName, Resources resources, String key) {
        int resId = resources.getIdentifier(key, "string", packageName);
        if (0 == resId) {
            return null;
        }

        return resources.getString(resId);
    }

    private boolean getBooleanConfigValue(String packageName, Resources resources, String key) {
        int resId = resources.getIdentifier(key, "string", packageName);
        if (0 == resId) {
            return false;
        }

        return resources.getBoolean(resId);
    }
}
