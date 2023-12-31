import {React, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import api42 from '../api42/api';
import Toast from 'react-native-toast-message';
import {NetworkContext} from '../provider/Provider';

function LoginScreen({route, navigation}) {
  const networkContext = useContext(NetworkContext);
  useEffect(() => {
    if (route.params?.error) {
      console.log('ERROR IN Authentication');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication failed!',
      });
      return;
    }
    if (route.params?.code) {
      console.log('Authentication success');
      const fetchAccessToken = async () => {
        try {
          const token = await api42.getAccessToken(route.params.code);
          console.log('Token:', token);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Authentication success!',
          });
          navigation.navigate('StudentDetail', {token});
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Authentication failed!',
          });
        }
      };
      fetchAccessToken();
    }
  }, [route.params?.code, route.params?.error]);

  const handleLogin = () => {
    if (!networkContext.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'No Network',
        text2: 'You are not connected to the network!',
      });
      return;
    }
    navigation.navigate('AuthWebView');
  };

  return (
    <ImageBackground
      source={require('../images/back.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#130FAA',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
