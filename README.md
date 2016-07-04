## WKWebView Component for React Native

React Native comes with [WebView](http://facebook.github.io/react-native/docs/webview.html) component, which uses UIWebView on iOS. This component uses [WKWebView](http://nshipster.com/wkwebkit/) introduced in iOS 8 with all the performance boost. **Deployment Target >= iOS 8.0 is required**

### Install

1. You have to install from this repo: `npm install https://github.com/CRAlpha/react-native-wkwebview`
2. In the XCode's "Project navigator", right click on your project's Libraries folder ➜ Add Files to <...>
3. Go to node_modules ➜ react-native-wkwebview ➜ ios ➜ select RCTWKWebView folder and create a group
4. Compile and profit (Remember to set Minimum Deployment Target = 8.0)

### Usage

```
import WKWebView from 'react-native-wkwebview';
```

Try replacing your existing `WebView` with `WKWebView` and it should work in most cases.

### Compatibility with UIWebView

WKWebView aims to be a drop in replacement for UIWebView. However, some legacy UIWebView properties are not supported.

**Additional props:**

- onProgress

A callback to get the loading progress of WKWebView. Derived from [`estimatedProgress`](https://developer.apple.com/library/ios/documentation/WebKit/Reference/WKWebView_Ref/#//apple_ref/occ/instp/WKWebView/estimatedProgress) property.

```
<WKWebView onProgress={(progress) => console.log(progress)} />
```

`progress` is a double between 0 and 1.

- sendCookies

Set `sendCookies` to true to copy cookies from `sharedHTTPCookieStorage` when calling loadRequest.  This emulates the behavior of react-native's `WebView` component.

**Currently supported props are:**

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

**Unsupported props are:**

- mediaPlaybackRequiresUserAction NO
- scalesPageToFit
- domStorageEnabled
- javaScriptEnabled
- allowsInlineMediaPlayback
- decelerationRate

If you look at the source, the JavaScript side is mostly derived from React Native's WebView. The Objective C side mostly deals with the API difference between UIWebView and WKWebView.

### Contribute

We battle test this component against our app. However, we haven't use all the props so if something does not work as expected, please open a issue or PR.
