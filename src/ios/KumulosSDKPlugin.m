/********* KumulosSDKPlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <KumulosSDK/KumulosSDK.h>
@import CoreLocation;

@interface KumulosSDKPlugin : CDVPlugin {
  // Member variables go here.
}

-(void)initBaseSdk:(CDVInvokedUrlCommand*)command;
-(void)getInstallId:(CDVInvokedUrlCommand*)command;
-(void)trackEvent:(CDVInvokedUrlCommand*)command;
-(void)sendLocationUpdate:(CDVInvokedUrlCommand*)command;
-(void)associateUserWithInstall:(CDVInvokedUrlCommand*)command;
-(void)pushStoreToken:(CDVInvokedUrlCommand*)command;

@end

@implementation KumulosSDKPlugin

- (void)initBaseSdk:(CDVInvokedUrlCommand*)command {
    NSString* apiKey = command.arguments[0];
    NSString* secretKey = command.arguments[1];
    NSNumber* enableCrashReporting = command.arguments[2];
    NSDictionary* sdkInfo = command.arguments[3];
    NSDictionary* runtimeInfo = command.arguments[4];

    KSConfig* config = [KSConfig configWithAPIKey:apiKey andSecretKey:secretKey];

    if ([enableCrashReporting isEqual: @(YES)]) {
        [config enableCrashReporting];
    }

    [config setSdkInfo:sdkInfo];
    [config setRuntimeInfo:runtimeInfo];

    [Kumulos initializeWithConfig:config];

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

- (void)getInstallId:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString: [Kumulos installId]];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)trackEvent:(CDVInvokedUrlCommand *)command {
    NSString* eventType = command.arguments[0];
    NSDictionary* properties = command.arguments[1];
    NSNumber* immediateFlush = command.arguments[2];

    if ([properties isEqual:[NSNull null]]) {
        properties = nil;
    }

    if ([immediateFlush isEqual:@(NO)]) {
        [Kumulos.shared trackEvent:eventType withProperties:properties];
    }
    else {
        [Kumulos.shared trackEventImmediately:eventType withProperties:properties];
    }

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void) sendLocationUpdate:(CDVInvokedUrlCommand *)command {
    double lat = [command.arguments[0] doubleValue];
    double lng = [command.arguments[1] doubleValue];

    CLLocation* location = [[CLLocation alloc] initWithLatitude:lat longitude:lng];
    [Kumulos.shared sendLocationUpdate:location];

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void)associateUserWithInstall:(CDVInvokedUrlCommand*)command {
    NSString* userIdentifier = command.arguments[0];
    NSDictionary* attributes = command.arguments[1];

    if (nil == attributes) {
        [Kumulos.shared associateUserWithInstall:userIdentifier];
    }
    else {
        [Kumulos.shared associateUserWithInstall:userIdentifier attributes:attributes];
    }

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void)pushStoreToken:(CDVInvokedUrlCommand *)command {
    NSString* token = command.arguments[0];

    // Data conversion from https://stackoverflow.com/a/7318062/543200
    NSMutableData* tokenData = [[NSMutableData alloc] init];

    unsigned char byte;
    char byteChars[3] = {'\0','\0','\0'};
    int i;

    for (i = 0; i < token.length / 2; i++) {
        byteChars[0] = [token characterAtIndex:i * 2];
        byteChars[1] = [token characterAtIndex:(i * 2) + 1];
        byte = strtol(byteChars, NULL, 16);
        [tokenData appendBytes:&byte length:1];
    }

    [Kumulos.shared pushRegisterWithDeviceToken:tokenData];

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

@end
