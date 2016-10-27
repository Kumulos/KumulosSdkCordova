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
             @"timeZone": [self timeZone]
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

@end
