// screens/StudentList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Button, Linking } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { fetchStudents, markAttendance, downloadPdfUrl } from '../api';
import { ActivityIndicator } from 'react-native';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const classId = 'classA'; // you can make this dynamic

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      Alert.alert('Error', 'Could not fetch students. Check server URL.');
      console.error(err);
    }
    setLoading(false);
  }

  async function authenticateAndMark(student) {
    // check if hardware available
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('No biometric hardware', 'This device has no biometric hardware.');
      return;
    }
    const supported = await LocalAuthentication.isEnrolledAsync();
    if (!supported) {
      Alert.alert('No biometrics enrolled', 'Please enroll fingerprint or use another device.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `Place your finger to mark ${student.name}`,
      fallbackLabel: 'Use PIN',
      disableDeviceFallback: false
    });

    if (result.success) {
      // mark attendance on server
      try {
        const r = await markAttendance(student.student_id, classId);
        Alert.alert('Success', `Attendance marked at ${new Date(r.timestamp).toLocaleString()}`);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not mark attendance on server.');
      }
    } else {
      Alert.alert('Authentication failed', 'Fingerprint not recognized or canceled.');
    }
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: '#ddd'
        }}
        onPress={() => authenticateAndMark(item)}
      >
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
        <Text style={{ color: '#555' }}>ID: {item.student_id}</Text>
      </TouchableOpacity>
    );
  }

  // quick PDF download by date (today)
  const downloadTodayPdf = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const date = `${yyyy}-${mm}-${dd}`;
    const url = downloadPdfUrl(date);
    // simply open in browser to download
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open URL'));
  };

  if (loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" /></View>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.student_id}
        renderItem={renderItem}
      />
      <View style={{ padding: 12 }}>
        <Button title="Download Today's PDF" onPress={downloadTodayPdf} />
      </View>
    </View>
  );
}
