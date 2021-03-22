/********* KumulosSDKPlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <KumulosSDK/KumulosSDK.h>
@import CoreLocation;

static const NSString* KSCordovaSdkVersion = @"4.2.3";

static CDVInvokedUrlCommand* KSjsCordovaCommand = nil;
static KSPushNotification* KSpendingPush = nil;

NSDictionary* KSPushDictFromModel(KSPushNotification* notification);

#pragma mark - Plugin interface

@interface KumulosSDKPlugin : CDVPlugin {
  // Member variables go here.
}

+(void)load;

-(BOOL) sendJsMessageWithType:(NSString*)type andData:(NSDictionary*) data;

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
-(void)inAppDeleteMessageFromInbox:(CDVInvokedUrlCommand*)command;

@end

static KumulosSDKPlugin* kumulosPluginInstance = nil;

@implementation KumulosSDKPlugin

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [NSNotificationCenter.defaultCenter addObserver: self
                                            selector: @selector(didFinishLaunching:)
                                            name: UIApplicationDidFinishLaunchingNotification
                                            object: nil];
    });
}

+ (void) didFinishLaunching: (NSNotification*) n
{
    NSString* configPath = [NSBundle.mainBundle pathForResource:@"kumulos" ofType:@"plist"];
    if (!configPath) {
        NSLog(@"kumulos.plist NOT FOUND");
        return;
    }

    NSDictionary* configValues = [[NSDictionary alloc] initWithContentsOfFile:configPath];

    if (n.userInfo){
        NSDictionary* userInfoDict = n.userInfo[UIApplicationLaunchOptionsRemoteNotificationKey];
        if (userInfoDict != nil) {
            KSpendingPush = [KSPushNotification fromUserInfo:userInfoDict];
        }
    }

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

    [config setPushReceivedInForegroundHandler:^(KSPushNotification * _Nonnull notification) {
        if (kumulosPluginInstance) {
            [kumulosPluginInstance sendJsMessageWithType:@"pushReceived" andData:KSPushDictFromModel(notification)];
        }
    }];
    [config setPushOpenedHandler:^(KSPushNotification * _Nonnull notification) {
        if (kumulosPluginInstance) {
            [kumulosPluginInstance sendJsMessageWithType:@"pushOpened" andData:KSPushDictFromModel(notification)];
        }
    }];
    [config setInAppDeepLinkHandler:^(NSDictionary * _Nonnull data) {
        if (kumulosPluginInstance) {
            [kumulosPluginInstance sendJsMessageWithType:@"inAppDeepLinkPressed" andData:data];
        }
    }];

    [Kumulos initializeWithConfig:config];

    return;
}

- (void)pluginInitialize {
    kumulosPluginInstance = self;
}

- (BOOL) sendJsMessageWithType:(NSString*)type andData:(NSDictionary*) data {
    if (!KSjsCordovaCommand) {
        return NO;
    }

    NSDictionary* message = @{@"type": type,
                              @"data": data
                              };

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [result setKeepCallback:@(1)];

    [self.commandDelegate sendPluginResult:result callbackId:KSjsCordovaCommand.callbackId];

    return YES;
}

- (void)initBaseSdk:(CDVInvokedUrlCommand*)command {
    KSjsCordovaCommand = command;

    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [result setKeepCallback:@(1)];

    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];

    if (KSpendingPush) {
        [self sendJsMessageWithType:@"pushOpened" andData:KSPushDictFromModel(KSpendingPush)];
        KSpendingPush = nil;
    }
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

-(void)inAppDeleteMessageFromInbox:(CDVInvokedUrlCommand*)command {
    NSNumber* messageId = command.arguments[0];

    NSArray<KSInAppInboxItem*>* inboxItems = [KumulosInApp getInboxItems];
    for (KSInAppInboxItem* msg in inboxItems) {
        if ([msg.id isEqualToNumber:messageId]) {
             BOOL result = [KumulosInApp deleteMessageFromInbox:msg];

            if (result) {
                [self.commandDelegate
                    sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
                    callbackId:command.callbackId];
                return;
            }

            break;
        }
    }

    [self.commandDelegate
     sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Message not found or not available"]
     callbackId:command.callbackId];
}

@end

#pragma mark - Helpers

NSDictionary* KSPushDictFromModel(KSPushNotification* notification) {
    NSDictionary* aps = notification.aps;
    NSDictionary *alert = aps[@"alert"] ?: @{};
    NSString *title = alert[@"title"] ?: [NSNull null];
    NSString *message = alert[@"body"] ?: [NSNull null];
    NSString *url = notification.url ? [notification.url absoluteString] : nil;

    NSMutableDictionary* push = [@{@"id": notification.id,
                           @"title": title,
                           @"message": message,
                           @"data": notification.data ?: NSNull.null,
                           @"url": url ?: NSNull.null
                           } mutableCopy];

    if (notification.actionIdentifier){
        [push setObject:notification.actionIdentifier forKey:@"actionId"];
    }

    return push;
}
