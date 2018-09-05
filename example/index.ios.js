import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import WkWebView from 'react-native-wkwebview-reborn';

export default class example extends Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <WkWebView style={{ backgroundColor: '#ff0000' }}
          contentInsetAdjustmentBehavior="always"
          userAgent="MyFancyWebView"
          hideKeyboardAccessoryView={false}
          ref={(c) => this.webview = c}
          sendCookies={true}
          source={{ uri: 'https://example.org/' }}
          onMessage={(e) => console.log(e.nativeEvent)}
          onNavigationResponse={(e) => console.log(e.nativeEvent)}
          injectedJavaScript="window.postMessage('Hello from WkWebView'); document.addEventListener('message', function(e) { alert(e.data); });"
        />
        <Text style={{ fontWeight: 'bold', padding: 10 }} onPress={() => this.webview.reload()}>Reload</Text>
        <Text style={{ fontWeight: 'bold', padding: 10 }} onPress={() => this.webview.postMessage("Hello from React Native")}>Post Message</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('example', () => example);
