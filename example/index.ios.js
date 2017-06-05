import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import WkWebView from 'react-native-wkwebview-reborn';

export default class example extends Component {
  componentWillMount() {
    
  }
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <WkWebView style={{ backgroundColor: '#ff0000' }} 
          userAgent="MyFancyWebView"
          hideKeyboardAccessoryView={false}
          ref="webview" 
          sendCookies={true} 
          source={{ uri: 'https://httpbin.org/get' }} />
        <Text style={{ fontWeight: 'bold', padding: 10 }} onPress={() => this.refs.webview.reload()}>Reload</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('example', () => example);
