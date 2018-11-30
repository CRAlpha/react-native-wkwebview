## WKWebView Component for React Native

[![npm version](https://badge.fury.io/js/react-native-wkwebview-reborn.svg)](https://badge.fury.io/js/react-native-wkwebview-reborn)

React Native comes with [WebView](http://facebook.github.io/react-native/docs/webview.html) component, which uses UIWebView on iOS. This component uses [WKWebView](http://nshipster.com/wkwebkit/) introduced in iOS 8 with all the performance boost.

**Deployment Target >= iOS 8.0 is required** *(which is React Native's current minimum deployment target anyway).*

### Install

1. Install from npm (note the postfix in the package name): `npm install react-native-wkwebview-reborn`
2. run `react-native link react-native-wkwebview-reborn`

**Manual alternative**

1. Install from npm (note the postfix in the package name): `npm install react-native-wkwebview-reborn`
2. In the XCode's "Project navigator", right click on your project's Libraries folder ➜ Add Files to <...>
3. Go to node_modules ➜ react-native-wkwebview-reborn ➜ ios ➜ select `RCTWKWebView.xcodeproj`
4. Go your build target ➜ Build Phases ➜ Link Binary With Libraries, click "+" and select `libRCTWkWebView.a` (see the following screenshot for reference)
![Linking](https://user-images.githubusercontent.com/608221/28060167-0650e3f4-6659-11e7-8085-7a8c2615f90f.png)
5. Compile and profit (Remember to set Minimum Deployment Target = 8.0)


### Usage

```js
import WKWebView from 'react-native-wkwebview-reborn';
```

Try replacing your existing `WebView` with `WKWebView` and it should work in most cases.

For React Native >= 0.57, use version 2.x; for React Native < 0.40, use version 0.x.

### Compatibility with UIWebView

WKWebView aims to be a drop-in replacement for UIWebView. However, some legacy UIWebView properties are not supported.

**Since 1.14.0, WkWebView supports `onMessage` and `postMessage` as in the default WebView. You can refer to the React Native documentation or the `example` project. For advanced or customized usage, please refer to [Advanced Communication between React Native and WkWebView](#advanced-communication-between-react-native-and-wkwebview).**

#### Additional props:

- **onProgress**

A callback to get the loading progress of WKWebView. Derived from [`estimatedProgress`](https://developer.apple.com/library/ios/documentation/WebKit/Reference/WKWebView_Ref/#//apple_ref/occ/instp/WKWebView/estimatedProgress) property.

```js
<WKWebView onProgress={(progress) => console.log(progress)} />
```

`progress` is a double between 0 and 1.

- **onNavigationResponse**

A callback to get response headers, http status code and http localized status code.

- **openNewWindowInWebView**

If set to true, links with `target="_blank"` or `window.open` will be opened in the current webview, not in Safari. Default is false.

- **sendCookies**

Set `sendCookies` to true to copy cookies from `sharedHTTPCookieStorage` when calling loadRequest.  This emulates the behavior of react-native's `WebView` component. You can set cookies using `react-native-cookies` Default is false.

- **source={{file: '', allowingReadAccessToURL: '' }}**

This allows WKWebView loads a local HTML file. Please note the underlying API is only introduced in iOS 9+. So in iOS 8, it will simple ignores these two properties.
It allows you to provide a fallback URL for iOS 8 users.

```js
<WKWebView source={{ file: RNFS.MainBundlePath + '/data/index.html', allowingReadAccessToURL: RNFS.MainBundlePath }} />
```

You can also use the `require` syntax (sendCookies and userAgent will be ignored)

```js
<WKWebView source={require('./index.html')} />
```

- **userAgent="MyUserAgent" (or customUserAgent="...")**

Set a custom user agent for WKWebView. Note this only works on iOS 9+. Previous version will simply ignore this props.

- **hideKeyboardAccessoryView**

This will hide the keyboard accessory view (`<` `>` and `Done`). Default is false.

- **allowsLinkPreview**

A Boolean value that determines whether pressing on a link displays a preview of the destination for the link. This props is available on devices that support 3D Touch. In iOS 10 and later, the default value is true; before that, the default value is false.

- **contentInsetAdjustmentBehavior**

This property specifies how the safe area insets are used to modify the content area of the scroll view. The default value of this property is "never". Available on iOS 11 and later. Possible values are "automatic", "scrollableAxes", "never", "always". **New in 1.16.0**

- **keyboardDisplayRequiresUserAction**

Enables focusing an input inside a webview and showing the keyboard *programatically*. **New in 1.20.0**

- **keyboardDismissMode**

Sets the manner in which the keyboard is dismissed when a drag begins in the scroll view. Possible values are "none", "on-drag" and "interactive". Default to "none".

- **injectJavaScript, injectJavaScriptForMainFrameOnly**

Add JavaScript at document start, see [WKUserScriptInjectionTimeAtDocumentStart](https://developer.apple.com/documentation/webkit/wkuserscriptinjectiontime/wkuserscriptinjectiontimeatdocumentstart?language=objc). **New in 1.20.0**

- **injectedJavaScript, injectedJavaScriptForMainFrameOnly**

Add JavaScript at document end. Since 1.20.0, the implementation has been changed to use WKUserScript.

- **allowsBackForwardNavigationGestures**

Enable horizontal swipe gestures will trigger back-forward navigations. Derived from [`allowsBackForwardNavigationGestures`](https://developer.apple.com/documentation/webkit/wkwebview/1414995-allowsbackforwardnavigationgestu) property.

#### Currently supported props are:

- automaticallyAdjustContentInsets
- contentInset
- html (deprecated)
- injectJavaScript
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
- pagingEnabled
- scrollEnabled
- directionalLockEnabled

####  Unsupported props are:

- mediaPlaybackRequiresUserAction
- scalesPageToFit
- domStorageEnabled
- javaScriptEnabled
- allowsInlineMediaPlayback
- decelerationRate

### Advanced Communication between React Native and WkWebView


#### Communication from WKWebview to React Native

- **onMessage**

This utilizes the message handlers in WKWebView and allows you to post message from webview to React Native. For example:

```js
<WKWebView onMessage={(e) => console.log(e)} />
```

Then in your webview, you can post message to React Native using

```js
window.webkit.messageHandlers.reactNative.postMessage({message: 'hello!'});
```

or (since 1.14.0)

```js
window.postMessage({message: 'hello!'});
```

Then you can access the nativeEvent in React Native using the event object returned

```js
e.nativeEvent => {
  name: 'reactNative',
  data: {
    message: 'hello!'
  }
}
```

The data serialization flow is as follows:

```
 JS — (via WKWebView) --> ObjC --- (via React Native Bridge) ---> JS
```

So I recommend to keep your data simple and JSON-friendly.

#### Communication from React Native to WkWebView

There is a `evaluateJavaScript` method on WKWebView, which does exactly what its name suggests. To send message from React Native to WebView,
you can define a callback method on your WebView:

```js
window.receivedMessageFromReactNative = function(data) {
  // Code here
  console.log(data);
}
```

Then you can send message from React Native with this method call:

```js
// <WKWebView ref={ref => { this.webview = ref; }} />
this.webview.evaluateJavaScript('receivedMessageFromReactNative("Hello from the other side.")');
```

If you look at the source, the JavaScript side is mostly derived from React Native's WebView. The Objective C side mostly deals with the API difference between UIWebView and WKWebView.

### Contribute

We battle test this component against our app. However, we haven't use all the props so if something does not work as expected, please open an issue or PR.
