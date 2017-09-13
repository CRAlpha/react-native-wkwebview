'use strict';

import React, {
  PropTypes
} from 'react';
import ReactNative, {
  requireNativeComponent,
  EdgeInsetsPropType,
  StyleSheet,
  UIManager,
  View,
  ViewPropTypes,
  NativeModules,
  Text,
  ActivityIndicator
} from 'react-native';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import deprecatedPropType from 'react-native/Libraries/Utilities/deprecatedPropType';
import invariant from 'fbjs/lib/invariant';
import keyMirror from 'fbjs/lib/keyMirror';
var WKWebViewManager = NativeModules.WKWebViewManager;

var BGWASH = 'rgba(255,255,255,0.8)';
var RCT_WEBVIEW_REF = 'webview';

var WebViewState = keyMirror({
  IDLE: null,
  LOADING: null,
  ERROR: null,
});

const NavigationType = keyMirror({
  click: true,
  formsubmit: true,
  backforward: true,
  reload: true,
  formresubmit: true,
  other: true,
});

const JSNavigationScheme = 'react-js-navigation';

type ErrorEvent = {
  domain: any;
  code: any;
  description: any;
}

type Event = Object;

var defaultRenderLoading = () => (
  <View style={styles.loadingView}>
    <ActivityIndicator />
  </View>
);
var defaultRenderError = (errorDomain, errorCode, errorDesc) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTextTitle}>
      Error loading page
    </Text>
    <Text style={styles.errorText}>
      {'Domain: ' + errorDomain}
    </Text>
    <Text style={styles.errorText}>
      {'Error Code: ' + errorCode}
    </Text>
    <Text style={styles.errorText}>
      {'Description: ' + errorDesc}
    </Text>
  </View>
);

/**
 * Renders a native WebView.
 */

var WKWebView = React.createClass({
  statics: {
    JSNavigationScheme: JSNavigationScheme,
    NavigationType: NavigationType,
  },
  propTypes: {
    ...ViewPropTypes,

    html: deprecatedPropType(
      PropTypes.string,
      'Use the `source` prop instead.'
    ),

    url: deprecatedPropType(
      PropTypes.string,
      'Use the `source` prop instead.'
    ),

    /**
     * Loads static html or a uri (with optional headers) in the WebView.
     */
    source: PropTypes.oneOfType([
      PropTypes.shape({
        /*
         * The URI to load in the WebView. Can be a local or remote file.
         */
        uri: PropTypes.string,
        /*
         * The HTTP Method to use. Defaults to GET if not specified.
         * NOTE: On Android, only GET and POST are supported.
         */
        method: PropTypes.string,
        /*
         * Additional HTTP headers to send with the request.
         * NOTE: On Android, this can only be used with GET requests.
         */
        headers: PropTypes.object,
        /*
         * The HTTP body to send with the request. This must be a valid
         * UTF-8 string, and will be sent exactly as specified, with no
         * additional encoding (e.g. URL-escaping or base64) applied.
         * NOTE: On Android, this can only be used with POST requests.
         */
        body: PropTypes.string,
      }),
      PropTypes.shape({
        /*
         * A static HTML page to display in the WebView.
         */
        html: PropTypes.string,
        /*
         * The base URL to be used for any relative links in the HTML.
         */
        baseUrl: PropTypes.string,
      }),
      /*
       * Used internally by packager.
       */
      PropTypes.number,
    ]),

    /**
     * Function that returns a view to show if there's an error.
     */
    renderError: PropTypes.func, // view to show if there's an error
    /**
     * Function that returns a loading indicator.
     */
    renderLoading: PropTypes.func,
    /**
     * Invoked when load finish
     */
    onLoad: PropTypes.func,
    /**
     * Invoked when load either succeeds or fails
     */
    onLoadEnd: PropTypes.func,
    /**
     * Invoked on load start
     */
    onLoadStart: PropTypes.func,
    /**
     * Invoked when load fails
     */
    onError: PropTypes.func,
    /**
     * Report the progress
     */
    onProgress: PropTypes.func,
    /**
     * A function that is invoked when the webview calls `window.postMessage`.
     * Setting this property will inject a `postMessage` global into your
     * webview, but will still call pre-existing values of `postMessage`.
     *
     * `window.postMessage` accepts one argument, `data`, which will be
     * available on the event object, `event.nativeEvent.data`. `data`
     * must be a string.
     */
    onMessage: PropTypes.func,
    /**
     * @platform ios
     */
    bounces: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    allowsBackForwardNavigationGestures: PropTypes.bool,
    automaticallyAdjustContentInsets: PropTypes.bool,
    contentInset: EdgeInsetsPropType,
    onNavigationStateChange: PropTypes.func,
    scalesPageToFit: PropTypes.bool,
    startInLoadingState: PropTypes.bool,
    style: ViewPropTypes.style,
    /**
     * Sets the JS to be injected when the webpage loads.
     */
    injectedJavaScript: PropTypes.string,
    /**
     * Allows custom handling of any webview requests by a JS handler. Return true
     * or false from this method to continue loading the request.
     * @platform ios
     */
    onShouldStartLoadWithRequest: PropTypes.func,
    /**
     * Copies cookies from sharedHTTPCookieStorage when calling loadRequest.
     * Set this to true to emulate behavior of WebView component.
     */
    sendCookies: PropTypes.bool,
    /**
     * If set to true, target="_blank" or window.open will be opened in WebView, instead
     * of new window. Default is false to be backward compatible.
     */
    openNewWindowInWebView: PropTypes.bool,
    /**
     * Hide the accessory view when the keyboard is open. Default is false to be
     * backward compatible.
     */
    hideKeyboardAccessoryView: PropTypes.bool,
    /**
     * Sets the customized user agent by using of the WKWebView
    */
    customUserAgent: PropTypes.string,
    userAgent: PropTypes.string,
    /**
     * A Boolean value that determines whether paging is enabled for the scroll view.
    */
    pagingEnabled: PropTypes.bool,
    /**
     * A Boolean value that sets whether diagonal scrolling is allowed.
    */
    directionalLockEnabled: PropTypes.bool,
  },
  getInitialState() {
    return {
      viewState: WebViewState.IDLE,
      lastErrorEvent: (null: ?ErrorEvent),
      startInLoadingState: true,
    };
  },

  componentWillMount: function() {
    if (this.props.startInLoadingState) {
      this.setState({viewState: WebViewState.LOADING});
    }
  },

  render() {
    var otherView = null;

    if (this.state.viewState === WebViewState.LOADING) {
      otherView = (this.props.renderLoading || defaultRenderLoading)();
    } else if (this.state.viewState === WebViewState.ERROR) {
      var errorEvent = this.state.lastErrorEvent;
      invariant(
        errorEvent != null,
        'lastErrorEvent expected to be non-null'
      );
      otherView = (this.props.renderError || defaultRenderError)(
        errorEvent.domain,
        errorEvent.code,
        errorEvent.description
      );
    } else if (this.state.viewState !== WebViewState.IDLE) {
      console.error(
        'RCTWKWebView invalid state encountered: ' + this.state.loading
      );
    }

    var webViewStyles = [styles.container, styles.webView, this.props.style];
    if (this.state.viewState === WebViewState.LOADING ||
      this.state.viewState === WebViewState.ERROR) {
      // if we're in either LOADING or ERROR states, don't show the webView
      webViewStyles.push(styles.hidden);
    }

    var onShouldStartLoadWithRequest = this.props.onShouldStartLoadWithRequest && ((event: Event) => {
      var shouldStart = this.props.onShouldStartLoadWithRequest &&
        this.props.onShouldStartLoadWithRequest(event.nativeEvent);
      WKWebViewManager.startLoadWithResult(!!shouldStart, event.nativeEvent.lockIdentifier);
    });

    var source = Object.assign({}, this.props.source || {} , {
      sendCookies: this.props.sendCookies,
      customUserAgent: this.props.customUserAgent
    });
    if (this.props.html) {
      source.html = this.props.html;
    } else if (this.props.url) {
      source.uri = this.props.url;
    }

    const messagingEnabled = typeof this.props.onMessage === 'function';

    var webView =
      <RCTWKWebView
        ref={RCT_WEBVIEW_REF}
        key="webViewKey"
        style={webViewStyles}
        source={resolveAssetSource(source)}
        injectedJavaScript={this.props.injectedJavaScript}
        bounces={this.props.bounces}
        scrollEnabled={this.props.scrollEnabled}
        contentInset={this.props.contentInset}
        allowsBackForwardNavigationGestures={this.props.allowsBackForwardNavigationGestures}
        automaticallyAdjustContentInsets={this.props.automaticallyAdjustContentInsets}
        openNewWindowInWebView={this.props.openNewWindowInWebView}
        hideKeyboardAccessoryView={this.props.hideKeyboardAccessoryView}
        onLoadingStart={this._onLoadingStart}
        onLoadingFinish={this._onLoadingFinish}
        onLoadingError={this._onLoadingError}
        messagingEnabled={messagingEnabled}
        onMessage={this._onMessage}
        onProgress={this._onProgress}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        pagingEnabled={this.props.pagingEnabled}
        directionalLockEnabled={this.props.directionalLockEnabled}
      />;

    return (
      <View style={styles.container}>
        {webView}
        {otherView}
      </View>
    );
  },

  /**
   * Go forward one page in the webview's history.
   */
  goForward: function() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWKWebView.Commands.goForward,
      null
    );
  },

  /**
   * Go back one page in the webview's history.
   */
  goBack: function() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWKWebView.Commands.goBack,
      null
    );
  },

  /**
   * Indicating whether there is a back item in the back-forward list that can be navigated to
   */
  canGoBack: function() {
    return WKWebViewManager.canGoBack(this.getWebViewHandle());
  },

  /**
   * Indicating whether there is a forward item in the back-forward list that can be navigated to
   */
  canGoForward: function() {
    return WKWebViewManager.canGoForward(this.getWebViewHandle());
  },

  /**
   * Reloads the current page.
   */
  reload: function() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWKWebView.Commands.reload,
      null
    );
  },

  /**
   * Stop loading the current page.
   */
  stopLoading: function() {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWKWebView.Commands.stopLoading,
      null
    )
  },

  /**
   * Posts a message to the web view, which will emit a `message` event.
   * Accepts one argument, `data`, which must be a string.
   *
   * In your webview, you'll need to something like the following.
   *
   * ```js
   * document.addEventListener('message', e => { document.title = e.data; });
   * ```
   */
  postMessage: function(data) {
    UIManager.dispatchViewManagerCommand(
      this.getWebViewHandle(),
      UIManager.RCTWKWebView.Commands.postMessage,
      [String(data)]
    );
  },

  evaluateJavaScript: function(js) {
    return WKWebViewManager.evaluateJavaScript(this.getWebViewHandle(), js);
  },

  /**
   * We return an event with a bunch of fields including:
   *  url, title, loading, canGoBack, canGoForward
   */
  _updateNavigationState: function(event: Event) {
    if (this.props.onNavigationStateChange) {
      this.props.onNavigationStateChange(event.nativeEvent);
    }
  },

  /**
   * Returns the native webview node.
   */
  getWebViewHandle: function(): any {
    return ReactNative.findNodeHandle(this.refs[RCT_WEBVIEW_REF]);
  },

  _onLoadingStart: function(event: Event) {
    var onLoadStart = this.props.onLoadStart;
    onLoadStart && onLoadStart(event);
    this._updateNavigationState(event);
  },

  _onLoadingError: function(event: Event) {
    event.persist(); // persist this event because we need to store it
    var {onError, onLoadEnd} = this.props;
    onError && onError(event);
    onLoadEnd && onLoadEnd(event);
    console.warn('Encountered an error loading page', event.nativeEvent);

    this.setState({
      lastErrorEvent: event.nativeEvent,
      viewState: WebViewState.ERROR
    });
  },

  _onLoadingFinish: function(event: Event) {
    var {onLoad, onLoadEnd} = this.props;
    onLoad && onLoad(event);
    onLoadEnd && onLoadEnd(event);
    this.setState({
      viewState: WebViewState.IDLE,
    });
    this._updateNavigationState(event);
  },

  _onProgress(event: Event) {
    var onProgress = this.props.onProgress;
    onProgress && onProgress(event.nativeEvent.progress);
  },

  _onMessage(event: Event) {
    var {onMessage} = this.props;
    onMessage && onMessage(event);
  }
});

var RCTWKWebView = requireNativeComponent('RCTWKWebView', WKWebView, {
  nativeOnly: {
    onLoadingStart: true,
    onLoadingError: true,
    onLoadingFinish: true,
    onMessage: true,
    messagingEnabled: PropTypes.bool,
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BGWASH,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  errorTextTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  hidden: {
    height: 0,
    flex: 0, // disable 'flex:1' when hiding a View
  },
  loadingView: {
    backgroundColor: BGWASH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  webView: {
    backgroundColor: '#ffffff',
  }
});

export default WKWebView;
