import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

interface TurnstileProps {
  onTokenReceived: (token: string | null) => void;
}

export interface TurnstileRef {
  reset: () => void;
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  ({ onTokenReceived }, ref) => {
    const [webViewHeight, setWebViewHeight] = useState(80);
    const webViewRef = useRef<WebView>(null);

    const handleMessage = (event: WebViewMessageEvent) => {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'height') {
        setWebViewHeight(data.height);
      } else if (data.type === 'token') {
        onTokenReceived(data.token);
      }
    };

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenReceived(null);
        webViewRef.current?.injectJavaScript(`
          if (window.turnstileWidget) {
            turnstile.reset(window.turnstileWidget);
          }
          true;
        `);
      },
    }));

    return (
      <View style={[styles.container, { height: webViewHeight }]}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          onMessage={handleMessage}
          source={{
            baseUrl: process.env.EXPO_PUBLIC_API_URL,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
                  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_turnstileCb" async defer></script>
                  <style>
                    html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:center; }
                    #myWidget { width:100%; }
                  </style>
                </head>
                <body>
                  <div id="myWidget"></div>
                  <script>
                    function _turnstileCb() {
                      window.turnstileWidget = turnstile.render('#myWidget', {
                        sitekey: '${process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY}',
                        size: '${process.env.EXPO_PUBLIC_TURNSTILE_SIZE}',
                        callback: (token) => {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'token', token }));
                        },
                      });
                      setTimeout(() => {
                        const widget = document.getElementById('myWidget');
                        const height = widget ? widget.offsetHeight : 80;
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height }));
                      }, 1000);
                      window.addEventListener('resize', () => {
                        setTimeout(() => {
                          const widget = document.getElementById('myWidget');
                          const height = widget ? widget.offsetHeight : 80;
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'height', height }));
                        }, 100);
                      });
                    }
                  </script>
                </body>
              </html>
            `,
          }}
          style={styles.webView}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { width: '100%' },
  webView: { flex: 1 },
});
