#import <React/RCTViewManager.h>
#import <React/RCTConvert.h>
#import "RCTWKWebView.h"

@interface RCTConvert (UIScrollView)

@end

@interface RCTWKWebViewManager : RCTViewManager
@property (nonatomic, strong) RCTWKWebView * webView;
@end
