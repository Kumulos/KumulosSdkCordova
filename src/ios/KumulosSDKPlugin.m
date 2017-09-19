/********* KumulosSDKPlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "MobileProvision.h"

@interface KumulosSDKPlugin : CDVPlugin {
  // Member variables go here.
}

- (void)getDeviceInfo:(CDVInvokedUrlCommand*)command;
@end

@implementation KumulosSDKPlugin

- (void)getDeviceInfo:(CDVInvokedUrlCommand*)command
{
    NSDictionary* deviceProperties = [self deviceProperties];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:deviceProperties];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

- (NSDictionary*)deviceProperties
{

    return @{
             @"iOSTokenType": [self iosTokenType],
             @"timeZone": [self timeZone],
             @"locale": [self locale],
             @"bundleId": [self bundleId]
            };
}

- (NSNumber*)iosTokenType
{
    NSInteger const KSPushTokenTypeProduction = 1;

    UIApplicationReleaseMode releaseMode = [MobileProvision releaseMode];
    
    if (releaseMode == UIApplicationReleaseAdHoc
        || releaseMode == UIApplicationReleaseDev
        || releaseMode == UIApplicationReleaseWildcard) {
        return @(releaseMode + 1);
    }
    
    return @(KSPushTokenTypeProduction);
}

- (NSString*)timeZone
{
      NSTimeZone *timeZone = [NSTimeZone localTimeZone];
      NSString *tzName = [timeZone name];
      return tzName;
}

- (NSString*)locale
{
    return [[NSLocale preferredLanguages] objectAtIndex:0];
}

- (NSString*)bundleId
{
    NSString *bundle = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];

    return bundle;
}

@end
