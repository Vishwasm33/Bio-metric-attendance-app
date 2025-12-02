// screens/ManageStudentsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchStudents, registerStudent, deleteStudent } from '../api';

export default function ManageStudentsScreen() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('A'); // Default Class Filter
  const [loading, setLoading] = useState(false);

  const classList = ['A', 'B', 'C', 'D']; // ✨ Add sections here

  // Load students by selected section
  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      const filtered = data.filter(s => s.class_id === classId);
      setStudents(filtered);
    } catch (err) {
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [classId]); // 🔄 refresh list when section changed

  const handleAddStudent = async () => {
    if (!studentId.trim() || !studentName.trim()) {
      return Alert.alert('Validation', 'Please fill both ID and Name');
    }

    try {
      await registerStudent(studentId, studentName, classId);
      Alert.alert('Success', 'Student added!');
      setStudentId('');
      setStudentName('');
      loadStudents();
    } catch (err) {
      Alert.alert('Error', 'Failed to add student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      Alert.alert('Deleted', 'Student removed');
      loadStudents();
    } catch (err) {
      Alert.alert('Error', 'Failed to delete student');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Students</Text>

      {/* Select Section/Class */}
      <Picker
        selectedValue={classId}
        style={styles.input}
        onValueChange={(itemValue) => setClassId(itemValue)}>
        {classList.map(classItem => (
          <Picker.Item key={classItem} label={`Section ${classItem}`} value={classItem} />
        ))}
      </Picker>

      {/* Add Student */}
      <TextInput
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
        style={styles.input}
      />
      <TextInput
        placeholder="Student Name"
        value={studentName}
        onChangeText={setStudentName}
        style={styles.input}
      />
      <Button title="Add Student" onPress={handleAddStudent} color="#2196F3" />

      {/* List */}
      <Text style={styles.subHeader}>Students in Section: {classId}</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.student_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.student_id} - {item.name}</Text>
            <Button
              title="Delete"
              color="red"
              onPress={() => handleDeleteStudent(item.student_id)}
            />
          </View>
        )}
        ListEmptyComponent={<Text>No students found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});
