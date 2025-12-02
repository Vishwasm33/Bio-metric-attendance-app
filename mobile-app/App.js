// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ManageStudentsScreen from './screens/ManageStudentsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

export default function App() {
  console.log("✅ App.js loaded — starting from LoginScreen");

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#2196F3' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="AttendanceScreen"
          component={AttendanceScreen}
          options={{ title: 'Attendance' }}
        />
        <Stack.Screen
          name="ManageStudents"
          component={ManageStudentsScreen}
          options={{ title: 'Manage Students' }}
        />
        <Stack.Screen
          name="AnalyticsScreen"
          component={AnalyticsScreen}
          options={{ title: 'Analytics' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
