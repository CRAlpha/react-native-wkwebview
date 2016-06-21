//
//  MessageHandlerOpenScheme.h
//  WkwebviewSample
//
//  Created by LoveStar_PC on 6/21/16.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "RCTWKWebView.h"

@interface MessageHandlerOpenScheme : NSObject<WKScriptMessageHandler>
@property RCTWKWebView * parent;

@end
