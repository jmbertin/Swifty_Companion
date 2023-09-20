import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './navigator/navigator';
import {Linking} from 'react-native';
import Toast from 'react-native-toast-message';
import {NetworkProvider} from './provider/Provider';

function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    const eventListener = Linking.addEventListener('url', handleDeepLink);

    return () => {
      eventListener.remove();
    };
  }, []);

  const handleDeepLink = event => {
    const code = extractCodeFromUrl(event.url);
    if (code) {
      if (navigationRef.current) {
        navigationRef.current.navigate('LoginScreen', {code});
      }
    }
  };

  const extractCodeFromUrl = url => {
    const matched = url.match(/code=([\w.-]+)/);
    return matched && matched[1];
  };

  return (
    <NetworkProvider>
      <NavigationContainer ref={navigationRef}>
        <Navigator />
      </NavigationContainer>
      <Toast />
    </NetworkProvider>
  );
}

export default App;
