
#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

// Trampoline object to avoid retain cycle with the script message handler
@interface WeakScriptMessageDelegate : NSObject<WKScriptMessageHandler>

@property (nonatomic, weak) id<WKScriptMessageHandler> scriptDelegate;

- (instancetype)initWithDelegate:(id<WKScriptMessageHandler>)scriptDelegate;

@end

