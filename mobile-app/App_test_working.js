import React from 'react';
import { View, Text, StyleSheet, AppRegistry } from 'react-native';
import { name as appName } from './app.json';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Test App Loaded — Expo entry works ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18 }
});

AppRegistry.registerComponent(appName, () => App);
