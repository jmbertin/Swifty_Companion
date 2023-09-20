import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import AuthWebView from '../screens/AuthWebView';
import StudentDetail from '../screens/StudentDetailScreen';

const Stack = createStackNavigator();

function Navigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          title: 'Connexion',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#000',
            height: 45,
          },
        }}
      />
      <Stack.Screen
        name="AuthWebView"
        component={AuthWebView}
        options={{
          title: 'Authentification',
          headerStyle: {
            backgroundColor: '#000',
            height: 45,
          },
        }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetail}
        options={{
          title: 'Profile infos',
          headerStyle: {
            backgroundColor: '#000',
            height: 45,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      {/* ... autres écrans */}
    </Stack.Navigator>
  );
}

export default Navigator;
