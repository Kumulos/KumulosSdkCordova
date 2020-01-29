//
//  NotificationService.m
//  KumulosNotificationServiceExtension
//
//  Created by Vladislav Voicehovics on 05/12/2019.
//  Copyright © 2019 Kumulos. All rights reserved.
//

#import <KumulosSDKExtension/KumulosNotificationService.h>
#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
   [KumulosNotificationService didReceiveNotificationRequest:request withContentHandler: contentHandler];
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end