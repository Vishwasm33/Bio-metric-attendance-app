// screens/AttendanceScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,           // 👈 Linking imported here
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { fetchStudents, markAttendance, downloadPdfUrl } from '../api';

export default function AttendanceScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [classId, setClassId] = useState('A');
  const [loading, setLoading] = useState(true);
  const [isInsideArea, setIsInsideArea] = useState(false);

  // 📍 Geofence centre – change to your classroom coordinates if needed
  const CLASS_LAT = 13.090684;
  const CLASS_LON = 77.485607;
  const RADIUS = 10; // meters
  const classList = ['A', 'B', 'C', 'D'];

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in meters
  };

  const checkLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location for attendance.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const distance = getDistance(
        loc.coords.latitude,
        loc.coords.longitude,
        CLASS_LAT,
        CLASS_LON
      );
      console.log('📍 Distance from class (m):', distance);
      setIsInsideArea(distance <= RADIUS);
    } catch (err) {
      console.error('Location error:', err);
      Alert.alert('Error', 'Unable to get location.');
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      setStudents(data.filter((s) => s.class_id === classId));
    } catch (err) {
      console.error('Error fetching students:', err);
      Alert.alert('Error', 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    checkLocation();
  }, [classId]);

  const handleAttendance = async (student_id) => {
    if (!isInsideArea) {
      return Alert.alert('⛔ Stop', 'Move inside classroom area to mark attendance!');
    }

    const fingerprint = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Fingerprint required',
    });

    if (!fingerprint.success) {
      return Alert.alert('Failed', 'Fingerprint not matched. Try again.');
    }

    try {
      const loc = await Location.getCurrentPositionAsync({});
      await markAttendance(
        student_id,
        classId,
        loc.coords.latitude,
        loc.coords.longitude
      );
      Alert.alert('🎯 Marked', 'Attendance successfully updated!');
    } catch (err) {
      console.error('Error marking attendance:', err);
      Alert.alert('Error', 'Failed to mark attendance.');
    }
  };

  const handleDownloadPdf = () => {
    const today = new Date().toISOString().split('T')[0];
    const pdfUrl = downloadPdfUrl(today);

    console.log('📄 Opening PDF URL →', pdfUrl);

    Linking.openURL(pdfUrl).catch(() => {
      Alert.alert(
        'Error',
        'Failed to open PDF. Make sure backend is running and phone is on same Wi-Fi.'
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Attendance - Section {classId}</Text>

      {/* Geofence Status */}
      <Text
        style={[
          styles.geo,
          { color: isInsideArea ? 'green' : 'red' },
        ]}
      >
        {isInsideArea ? '🟢 Inside Class Zone' : '🔴 Outside Allowed Area'}
      </Text>

      {/* Section Dropdown */}
      <Picker
        selectedValue={classId}
        onValueChange={setClassId}
        style={styles.dropdown}
      >
        {classList.map((c) => (
          <Picker.Item key={c} label={`Section ${c}`} value={c} />
        ))}
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.student_id}
          ListEmptyComponent={<Text>No students in this class</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Button
                title="Mark"
                onPress={() => handleAttendance(item.student_id)}
              />
            </View>
          )}
        />
      )}

      {/* Manage Students */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ManageStudents')}
      >
        <Text style={styles.btnText}>Manage Students</Text>
      </TouchableOpacity>

      {/* ✅ Updated Download PDF button */}
      <TouchableOpacity style={styles.button} onPress={handleDownloadPdf}>
        <Text style={styles.btnText}>Download PDF</Text>
      </TouchableOpacity>

      {/* Analytics */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AnalyticsScreen')}
      >
        <Text style={styles.btnText}>View Analytics</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  dropdown: { backgroundColor: '#eee', marginBottom: 10 },
  geo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#ddd',
    marginVertical: 5,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
