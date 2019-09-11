#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function hasPlatform(context, platform) {
    return context.opts.platforms.indexOf(platform) > -1;
}

function replaceFields(str, fields) {
    return Object.keys(fields).reduce(
        (str, field) => str.replace(`{{${field}}}`, fields[field]),
        str
    );
}

function renderTemplate(name, values) {
    const templatePath = path.join(__dirname, name);
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
    return replaceFields(template, values);
}

function isEmpty(val) {
    return !val || !val.length;
}

function isString(val) {
    return typeof val === 'string';
}

function isValidConfig(config) {
    if (!config || typeof config != 'object') {
        console.error('Kumulos: kumulos.json not a valid JSON object');
        return false;
    }

    if (
        isEmpty(config.apiKey) ||
        isEmpty(config.secretKey) ||
        !isString(config.apiKey) ||
        !isString(config.secretKey)
    ) {
        console.error(
            'Kumulos: invalid/missing apiKey or secretKey entries in kumulos.json'
        );
        return false;
    }

    const validInAppStrategies = ['auto-enroll', 'explicit-by-user'];

    if (
        !isEmpty(config.inAppConsentStrategy) &&
        validInAppStrategies.indexOf(config.inAppConsentStrategy) < 0
    ) {
        console.error(
            'Kumulos: invalid inAppConsentStrategy given in kumulos.json, valid options are: ' +
                validInAppStrategies.join(', ')
        );
        return false;
    } else if (isEmpty(config.inAppConsentStrategy)) {
        config.inAppConsentStrategy = 'in-app-disabled';
    }

    if (typeof config.enableCrashReporting === 'undefined') {
        config.enableCrashReporting = false;
    } else if (typeof config.enableCrashReporting !== 'boolean') {
        console.error(
            'Kumulos: invalid enableCrashReporting flag given in kumulos.json'
        );
        return false;
    }

    return true;
}

function readKumulosSettings(context) {
    const configFile = path.join(context.opts.projectRoot, 'kumulos.json');

    if (!fs.existsSync(configFile)) {
        console.warn(
            'Kumulos: config file not found, please ensure kumulos.json is present in your project root'
        );
        return false;
    }

    const configJson = fs.readFileSync(configFile, { encoding: 'utf-8' });
    let config;

    try {
        config = JSON.parse(configJson);
    } catch (e) {
        console.error('Kumulos: kumulos.json file not valid JSON');
        return false;
    }

    if (!isValidConfig(config)) {
        return false;
    }

    return config;
}

function prepareAndroid(context, kumulosConfig) {
    const dest = path.join(
        context.opts.projectRoot,
        'platforms',
        'android',
        'app',
        'src',
        'main',
        'res',
        'values',
        'kumulos.xml'
    );

    const config = renderTemplate('kumulos.xml', {
        API_KEY: kumulosConfig.apiKey,
        SECRET_KEY: kumulosConfig.secretKey,
        ENABLE_CRASH: kumulosConfig.enableCrashReporting,
        IN_APP_STRATEGY: kumulosConfig.inAppConsentStrategy
    });

    fs.writeFileSync(dest, config, { encoding: 'utf-8' });

    const gServicesJson = path.join(
        context.opts.projectRoot,
        'google-services.json'
    );

    if (fs.existsSync(gServicesJson)) {
        console.info(
            'Kumulos: found google-services.json, copying into appropriate place for FCM'
        );
        const gServicesDest = path.join(
            context.opts.projectRoot,
            'platforms',
            'android',
            'app',
            'google-services.json'
        );
        fs.copyFileSync(gServicesJson, gServicesDest);
    } else {
        console.warn(
            'Kumulos: no google-services.json was found, skipping FCM configuration'
        );
    }
}

function prepareIos(context, kumulosConfig) {}

module.exports = function injectKumulosConfig(context) {
    const kumulosConfig = readKumulosSettings(context);

    if (!kumulosConfig) {
        return;
    }

    if (hasPlatform(context, 'android')) {
        console.info('Kumulos: Preparing Android platform...');
        prepareAndroid(context, kumulosConfig);
    }

    if (hasPlatform(context, 'ios')) {
        console.info('Kumulos: Preparing iOS platform...');
        prepareIos(context, kumulosConfig);
    }
};
