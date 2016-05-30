## WKWebView Component for React Native

React Native comes with [WebView](http://facebook.github.io/react-native/docs/webview.html) component, which uses UIWebView on iOS. This component uses [WKWebView](http://nshipster.com/wkwebkit/) introduced in iOS 8 with all the performance boost. **Deployment Target >= iOS 8.0 is required**

### Compatibility with UIWebView

WKWebView aims to be a drop in replacement for UIWebView. However, some legacy UIWebView properties are not supported.

Currently supported props are:

- automaticallyAdjustContentInsets
- contentInset
- html (deprecated)
- injectedJavaScript
- onError
- onLoad
- onLoadEnd
- onLoadStart
- onNavigationStateChange
- renderError
- renderLoading
- source
- startInLoadingState
- style
- url (deprecated)
- bounces
- onShouldStartLoadWithRequest
- scrollEnabled

Unsupported props are:

- mediaPlaybackRequiresUserAction NO
- scalesPageToFit
- domStorageEnabled
- javaScriptEnabled
- allowsInlineMediaPlayback
- decelerationRate

If you look at the source, the JavaScript side is mostly derived from React Native's WebView. The Objective C side mostly deals with the API difference between UIWebView and WKWebView.
