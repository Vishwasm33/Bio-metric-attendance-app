import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { loginUser } from '../api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert('Validation', 'Please enter username and password');
    }

    setLoading(true);
    try {
      const user = await loginUser(username, password);
      Alert.alert('✅ Success', `Welcome, ${user.username}!`);
      navigation.replace('AttendanceScreen');
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('❌ Login Failed', 'Invalid credentials or server issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Attendance App</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#2196F3' },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  loginText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
