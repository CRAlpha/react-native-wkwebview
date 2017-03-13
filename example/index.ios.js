import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import WkWebView from 'react-native-wkwebview-reborn';
import CookieManager from 'react-native-cookies';

export default class example extends Component {
  componentWillMount() {
    CookieManager.set({
      name: 'WkWebView',
      value: Date.now().toString(),
      domain: 'httpbin.org',
      origin: 'httpbin.org',
      path: '/get',
      version: '1',
      expiration: '2042-04-20T12:30:00.00+08:00'
    }, () => { });
  }
  render() {
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <WkWebView style={{ backgroundColor: '#ff0000' }} customUserAgent="MyUserAgent" ref="webview" sendCookies={true} source={{ uri: 'https://httpbin.org/get' }} />
        <Text style={{ fontWeight: 'bold', padding: 10 }} onPress={() => this.refs.webview.reload()}>Reload</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('example', () => example);
