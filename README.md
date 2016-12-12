## WKWebView Component for React Native

[![npm version](https://badge.fury.io/js/react-native-wkwebview-reborn.svg)](https://badge.fury.io/js/react-native-wkwebview-reborn)

React Native comes with [WebView](http://facebook.github.io/react-native/docs/webview.html) component, which uses UIWebView on iOS. This component uses [WKWebView](http://nshipster.com/wkwebkit/) introduced in iOS 8 with all the performance boost. **Deployment Target >= iOS 8.0 is required**

### Install

**Alternative #1**

1. Install from npm (note the postfix in the package name): `npm install react-native-wkwebview-reborn`
2. In the XCode's "Project navigator", right click on your project's Libraries folder ➜ Add Files to <...>
3. Go to node_modules ➜ react-native-wkwebview ➜ ios ➜ select RCTWKWebView folder and create a group
4. Compile and profit (Remember to set Minimum Deployment Target = 8.0)

**Alternative #2**

1. Install from npm (note the postfix in the package name): `npm install react-native-wkwebview-reborn`
2. run `rnpm link`

**Notes to iOS 8:**

If you install from using Alterntive #2, you might encounter bugs in iOS 8.2 (We've only tested this version) where the app crashes with `dyld_fatal_error`.
This can be solved using Alternative #1. We were still unable to find the cause of the first bug so I recommend that you link the library using Alternative #1.


### Usage

```
import WKWebView from 'react-native-wkwebview';
```

Try replacing your existing `WebView` with `WKWebView` and it should work in most cases.

### Compatibility with UIWebView

WKWebView aims to be a drop-in replacement for UIWebView. However, some legacy UIWebView properties are not supported.

**Additional props:**

- onProgress

A callback to get the loading progress of WKWebView. Derived from [`estimatedProgress`](https://developer.apple.com/library/ios/documentation/WebKit/Reference/WKWebView_Ref/#//apple_ref/occ/instp/WKWebView/estimatedProgress) property.

```
<WKWebView onProgress={(progress) => console.log(progress)} />
```

`progress` is a double between 0 and 1.

- sendCookies

Set `sendCookies` to true to copy cookies from `sharedHTTPCookieStorage` when calling loadRequest.  This emulates the behavior of react-native's `WebView` component.

**From WKWebview -> React Native**

- onMessage

This utilizes the message handlers in WKWebView and allows you to post message from webview to React Native. For example:

```
<WKWebView onMessage={(e) => console.log(e)} />
```

Then in your webview, you can post message to React Native using

```
window.webkit.messageHandlers.reactNative.postMessage({data: 'hello!'});
```

Then your React Native should have 

```
{name: 'reactNative', body: {data: 'hello!'}}
```

The data serialization flow is as follows:

JS --- (via WKWebView) --> ObjC --- (via React Native Bridge) ---> JS

So I recommend to keep your data simple and JSON-friendly.

**From React Native -> WkWebView**

There is a `evaluateJavaScript` method on WKWebView, which does exactly what its name suggests. I recommend to put the code in onLoadEnd callback to make sure
it does not mess up the DOM.

```
<WKWebView ref="webview" onLoadEnd={() => { this.refs.webview.evaluateJavaScript('document.title').then(console.log) }} />
```

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

- mediaPlaybackRequiresUserAction
- scalesPageToFit
- domStorageEnabled
- javaScriptEnabled
- allowsInlineMediaPlayback
- decelerationRate

If you look at the source, the JavaScript side is mostly derived from React Native's WebView. The Objective C side mostly deals with the API difference between UIWebView and WKWebView.

### Contribute

We battle test this component against our app. However, we haven't use all the props so if something does not work as expected, please open a issue or PR.
