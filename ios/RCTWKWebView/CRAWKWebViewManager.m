#import "CRAWKWebViewManager.h"

#import "CRAWKWebView.h"
#import "WKProcessPool+SharedProcessPool.h"
#import <React/RCTBridge.h>
#import <React/RCTUtils.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTBridgeModule.h>

#import <WebKit/WebKit.h>

@implementation RCTConvert (UIScrollView)

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 110000 /* __IPHONE_11_0 */
RCT_ENUM_CONVERTER(UIScrollViewContentInsetAdjustmentBehavior, (@{
                                                                  @"automatic": @(UIScrollViewContentInsetAdjustmentAutomatic),
                                                                  @"scrollableAxes": @(UIScrollViewContentInsetAdjustmentScrollableAxes),
                                                                  @"never": @(UIScrollViewContentInsetAdjustmentNever),
                                                                  @"always": @(UIScrollViewContentInsetAdjustmentAlways),
                                                                  }), UIScrollViewContentInsetAdjustmentNever, integerValue)
#endif

RCT_ENUM_CONVERTER(UIScrollViewKeyboardDismissMode, (@{
                                                      @"none": @(UIScrollViewKeyboardDismissModeNone),
                                                      @"on-drag": @(UIScrollViewKeyboardDismissModeOnDrag),
                                                      @"interactive": @(UIScrollViewKeyboardDismissModeInteractive),
                                                      }), UIScrollViewKeyboardDismissModeNone, integerValue)

@end

@interface CRAWKWebViewManager () <CRAWKWebViewDelegate>

@end

@implementation CRAWKWebViewManager
{
  NSConditionLock *_shouldStartLoadLock;
  BOOL _shouldStartLoad;
}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  CRAWKWebView *webView = [[CRAWKWebView alloc] initWithProcessPool:[WKProcessPool sharedProcessPool]];
  webView.delegate = self;
  return webView;
}

RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary)
RCT_REMAP_VIEW_PROPERTY(bounces, _webView.scrollView.bounces, BOOL)
RCT_REMAP_VIEW_PROPERTY(pagingEnabled, _webView.scrollView.pagingEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(scrollEnabled, _webView.scrollView.scrollEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(keyboardDismissMode, _webView.scrollView.keyboardDismissMode, UIScrollViewKeyboardDismissMode)
RCT_REMAP_VIEW_PROPERTY(directionalLockEnabled, _webView.scrollView.directionalLockEnabled, BOOL)
RCT_REMAP_VIEW_PROPERTY(allowsBackForwardNavigationGestures, _webView.allowsBackForwardNavigationGestures, BOOL)
RCT_EXPORT_VIEW_PROPERTY(injectJavaScriptForMainFrameOnly, BOOL)
RCT_EXPORT_VIEW_PROPERTY(injectedJavaScriptForMainFrameOnly, BOOL)
RCT_EXPORT_VIEW_PROPERTY(injectJavaScript, NSString)
RCT_EXPORT_VIEW_PROPERTY(injectedJavaScript, NSString)
RCT_EXPORT_VIEW_PROPERTY(openNewWindowInWebView, BOOL)
RCT_EXPORT_VIEW_PROPERTY(contentInset, UIEdgeInsets)
RCT_EXPORT_VIEW_PROPERTY(automaticallyAdjustContentInsets, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onLoadingStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingFinish, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLoadingError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onShouldStartLoadWithRequest, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onProgress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMessage, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScroll, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(hideKeyboardAccessoryView, BOOL)
RCT_EXPORT_VIEW_PROPERTY(keyboardDisplayRequiresUserAction, BOOL)
RCT_EXPORT_VIEW_PROPERTY(messagingEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(allowsLinkPreview, BOOL)
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 110000 /* __IPHONE_11_0 */
RCT_EXPORT_VIEW_PROPERTY(contentInsetAdjustmentBehavior, UIScrollViewContentInsetAdjustmentBehavior)
#endif
RCT_EXPORT_VIEW_PROPERTY(onNavigationResponse, RCTDirectEventBlock)

RCT_EXPORT_METHOD(goBack:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CRAWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CRAWKWebView, got: %@", view);
    } else {
      [view goBack];
    }
  }];
}

RCT_EXPORT_METHOD(goForward:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CRAWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CRAWKWebView, got: %@", view);
    } else {
      [view goForward];
    }
  }];
}

RCT_EXPORT_METHOD(canGoBack:(nonnull NSNumber *)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];

    resolve([NSNumber numberWithBool:[view canGoBack]]);
  }];
}

RCT_EXPORT_METHOD(canGoForward:(nonnull NSNumber *)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];

    resolve([NSNumber numberWithBool:[view canGoForward]]);
  }];
}

RCT_EXPORT_METHOD(reload:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CRAWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CRAWKWebView, got: %@", view);
    } else {
      [view reload];
    }
  }];
}

RCT_EXPORT_METHOD(stopLoading:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CRAWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CRAWKWebView, got: %@", view);
    } else {
      [view stopLoading];
    }
  }];
}

RCT_EXPORT_METHOD(postMessage:(nonnull NSNumber *)reactTag message:(NSString *)message)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
        CRAWKWebView *view = viewRegistry[reactTag];
        if (![view isKindOfClass:[CRAWKWebView class]]) {
            RCTLogError(@"Invalid view returned from registry, expecting CRAWKWebView, got: %@", view);
        } else {
            [view postMessage:message];
        }
    }];
}

RCT_EXPORT_METHOD(evaluateJavaScript:(nonnull NSNumber *)reactTag
                  js:(NSString *)js
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CRAWKWebView *> *viewRegistry) {
    CRAWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[CRAWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting CRAWKWebView, got: %@", view);
    } else {
      [view evaluateJavaScript:js completionHandler:^(id result, NSError *error) {
        if (error) {
          reject(@"js_error", @"Error occurred while evaluating Javascript", error);
        } else {
          resolve(result);
        }
      }];
    }
  }];
}

#pragma mark - Exported synchronous methods

- (BOOL)webView:(__unused CRAWKWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback
{
  _shouldStartLoadLock = [[NSConditionLock alloc] initWithCondition:arc4random()];
  _shouldStartLoad = YES;
  request[@"lockIdentifier"] = @(_shouldStartLoadLock.condition);
  callback(request);

  // Block the main thread for a maximum of 250ms until the JS thread returns
  if ([_shouldStartLoadLock lockWhenCondition:0 beforeDate:[NSDate dateWithTimeIntervalSinceNow:.25]]) {
    BOOL returnValue = _shouldStartLoad;
    [_shouldStartLoadLock unlock];
    _shouldStartLoadLock = nil;
    return returnValue;
  } else {
    RCTLogWarn(@"Did not receive response to shouldStartLoad in time, defaulting to YES");
    return YES;
  }
}

RCT_EXPORT_METHOD(startLoadWithResult:(BOOL)result lockIdentifier:(NSInteger)lockIdentifier)
{
  if ([_shouldStartLoadLock tryLockWhenCondition:lockIdentifier]) {
    _shouldStartLoad = result;
    [_shouldStartLoadLock unlockWithCondition:0];
  } else {
    RCTLogWarn(@"startLoadWithResult invoked with invalid lockIdentifier: "
               "got %zd, expected %zd", lockIdentifier, _shouldStartLoadLock.condition);
  }
}

@end
