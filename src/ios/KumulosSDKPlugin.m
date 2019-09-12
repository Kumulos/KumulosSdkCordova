/********* KumulosSDKPlugin.m Cordova Plugin Implementation *******/

#import <objc/runtime.h>
#import <Cordova/CDV.h>
#import <KumulosSDK/KumulosSDK.h>
@import CoreLocation;

static const NSString* KSCordovaSdkVersion = @"4.0.0";
static IMP existingAppDidLaunchDelegate = NULL;

BOOL kumulos_applicationDidFinishLaunchingWithOptions(id self, SEL _cmd, UIApplication* application, NSDictionary* launchOptions);

#pragma mark - Plugin interface

@interface KumulosSDKPlugin : CDVPlugin {
  // Member variables go here.
}

+(void)load;

-(void)initBaseSdk:(CDVInvokedUrlCommand*)command;
-(void)getInstallId:(CDVInvokedUrlCommand*)command;
-(void)trackEvent:(CDVInvokedUrlCommand*)command;
-(void)sendLocationUpdate:(CDVInvokedUrlCommand*)command;
-(void)associateUserWithInstall:(CDVInvokedUrlCommand*)command;
-(void)clearUserAssociation:(CDVInvokedUrlCommand*)command;
-(void)getCurrentUserId:(CDVInvokedUrlCommand*)command;
-(void)pushRegister:(CDVInvokedUrlCommand*)command;
-(void)pushUnregister:(CDVInvokedUrlCommand*)command;
-(void)inAppUpdateUserConsent:(CDVInvokedUrlCommand*)command;
-(void)inAppGetInboxItems:(CDVInvokedUrlCommand*)command;
-(void)inAppPresentInboxMessage:(CDVInvokedUrlCommand*)command;

@end

@implementation KumulosSDKPlugin

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = CDVAppDelegate.class;

        // Did launch delegate
        SEL didLaunchSelector = @selector(application:didFinishLaunchingWithOptions:);
        const char *launchTypes = method_getTypeEncoding(class_getInstanceMethod(class, didLaunchSelector));

        existingAppDidLaunchDelegate = class_replaceMethod(class, didLaunchSelector, (IMP) kumulos_applicationDidFinishLaunchingWithOptions, launchTypes);
    });
}

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

-(void)clearUserAssociation:(CDVInvokedUrlCommand*)command {
    [Kumulos.shared clearUserAssociation];
    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void)getCurrentUserId:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString: Kumulos.currentUserIdentifier];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)pushRegister:(CDVInvokedUrlCommand*)command {
    [Kumulos.shared pushRequestDeviceToken];

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void)pushUnregister:(CDVInvokedUrlCommand*)command {
    [Kumulos.shared pushUnregister];

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void)inAppUpdateUserConsent:(CDVInvokedUrlCommand*)command {
    NSNumber* consented = command.arguments[0];

    [KumulosInApp updateConsentForUser:[consented isEqual:@(YES)]];

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
     callbackId:command.callbackId];
}

-(void)inAppGetInboxItems:(CDVInvokedUrlCommand*)command {
    NSArray<KSInAppInboxItem*>* inboxItems = [KumulosInApp getInboxItems];
    NSMutableArray<NSDictionary*>* items = [[NSMutableArray alloc] initWithCapacity:inboxItems.count];

    NSDateFormatter* formatter = [NSDateFormatter new];
    [formatter setTimeStyle:NSDateFormatterFullStyle];
    [formatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
    [formatter setTimeZone:[NSTimeZone timeZoneForSecondsFromGMT:0]];

    for (KSInAppInboxItem* item in inboxItems) {
        [items addObject:@{@"id": item.id,
                           @"title": item.title,
                           @"subtitle": item.subtitle,
                           @"availableFrom": item.availableFrom ? [formatter stringFromDate:item.availableFrom] : @"",
                           @"availableTo": item.availableTo ? [formatter stringFromDate:item.availableTo] : @"",
                           @"dismissedAt": item.dismissedAt ? [formatter stringFromDate:item.dismissedAt] : @""}];
    }

    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsArray:items];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)inAppPresentInboxMessage:(CDVInvokedUrlCommand*)command {
    NSNumber* messageId = command.arguments[0];

    NSArray<KSInAppInboxItem*>* inboxItems = [KumulosInApp getInboxItems];
    for (KSInAppInboxItem* msg in inboxItems) {
        if ([msg.id isEqualToNumber:messageId]) {
            KSInAppMessagePresentationResult result = [KumulosInApp presentInboxMessage:msg];

            if (result == KSInAppMessagePresentationPresented) {
                [self.commandDelegate
                    sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
                    callbackId:command.callbackId];
            } else {
                break;
            }
        }
    }

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Message not found or not available"]
     callbackId:command.callbackId];
}

@end

#pragma mark - SDK Initialization Hook

BOOL kumulos_applicationDidFinishLaunchingWithOptions(id self, SEL _cmd, UIApplication* application, NSDictionary* launchOptions) {

    BOOL result = YES;

    if (existingAppDidLaunchDelegate) {
        result = ((BOOL(*)(id,SEL,UIApplication*, NSDictionary*))existingAppDidLaunchDelegate)(self, _cmd, application, launchOptions);
    }

    NSString* configPath = [NSBundle.mainBundle pathForResource:@"kumulos" ofType:@"plist"];
    if (!configPath) {
        NSLog(@"kumulos.plist NOT FOUND");
        return result;
    }

    NSDictionary* configValues = [[NSDictionary alloc] initWithContentsOfFile:configPath];

    // TODO
    //    NSDictionary *userInfo = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    //    if (userInfo != nil) {
    //        KSStashPush(userInfo);
    //    }

    KSConfig* config = [KSConfig configWithAPIKey:configValues[@"apiKey"] andSecretKey:configValues[@"secretKey"]];

    if (configValues[@"enableCrashReporting"]) {
        [config enableCrashReporting];
    }

    if ([configValues[@"inAppConsentStrategy"] isEqualToString:@"auto-enroll"]) {
        [config enableInAppMessaging:KSInAppConsentStrategyAutoEnroll];
    } else if ([configValues[@"inAppConsentStrategy"] isEqualToString:@"explicit-by-user"]) {
        [config enableInAppMessaging:KSInAppConsentStrategyExplicitByUser];
    }

    [config setRuntimeInfo:@{@"id": @(3), @"version": CDV_VERSION}];
    [config setSdkInfo:@{@"id": @(6), @"version": KSCordovaSdkVersion}];

#if DEBUG
    [config setTargetType:TargetTypeDebug];
#else
    [config setTargetType:TargetTypeRelease];
#endif

    [config setPushReceivedInForegroundHandler:^(KSPushNotification * _Nonnull notification, KSPushReceivedInForegroundCompletionHandler completionHandler) {
        // TODO
        completionHandler(UNNotificationPresentationOptionAlert);
    }];
    [config setPushOpenedHandler:^(KSPushNotification * _Nonnull notification) {
        // TODO
    }];
    [config setInAppDeepLinkHandler:^(NSDictionary * _Nonnull data) {
        // TODO
    }];

    [Kumulos initializeWithConfig:config];

    return result;
}

