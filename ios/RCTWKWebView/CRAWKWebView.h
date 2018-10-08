#import <WebKit/WebKit.h>

#import <React/RCTView.h>

@class CRAWKWebView;

/**
 * Special scheme used to pass messages to the injectedJavaScript
 * code without triggering a page load. Usage:
 *
 *   window.location.href = RCTJSNavigationScheme + '://hello'
 */
extern NSString *const RCTJSNavigationScheme;

@protocol CRAWKWebViewDelegate <NSObject>

- (BOOL)webView:(CRAWKWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback;

@end

@interface CRAWKWebView : RCTView

- (instancetype)initWithProcessPool:(WKProcessPool *)processPool;

@property (nonatomic, weak) id<CRAWKWebViewDelegate> delegate;

@property (nonatomic, copy) NSDictionary *source;
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;
@property (nonatomic, assign) BOOL messagingEnabled;
@property (nonatomic, assign) BOOL allowsLinkPreview;
@property (nonatomic, assign) BOOL openNewWindowInWebView;
@property (nonatomic, assign) BOOL injectJavaScriptForMainFrameOnly;
@property (nonatomic, assign) BOOL injectedJavaScriptForMainFrameOnly;
@property (nonatomic, copy) NSString *injectJavaScript;
@property (nonatomic, copy) NSString *injectedJavaScript;
@property (nonatomic, assign) BOOL hideKeyboardAccessoryView;
@property (nonatomic, assign) BOOL keyboardDisplayRequiresUserAction;


- (void)goForward;
- (void)goBack;
- (BOOL)canGoBack;
- (BOOL)canGoForward;
- (void)reload;
- (void)stopLoading;
- (void)postMessage:(NSString *)message;
- (void)evaluateJavaScript:(NSString *)javaScriptString completionHandler:(void (^)(id, NSError *error))completionHandler;

@end
