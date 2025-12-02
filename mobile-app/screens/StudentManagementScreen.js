// screens/StudentManagementScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchStudents, registerStudent, deleteStudent } from '../api';

export default function StudentManagementScreen() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load students');
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!studentId || !name) {
      Alert.alert('Error', 'Enter student ID and name');
      return;
    }

    try {
      await registerStudent(studentId, name);
      Alert.alert('Success', 'Student registered successfully');
      setStudentId('');
      setName('');
      loadStudents();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to register student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      Alert.alert('Deleted', 'Student removed successfully');
      loadStudents();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete student');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎓 Manage Students</Text>

      <TextInput
        style={styles.input}
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
      />
      <TextInput
        style={styles.input}
        placeholder="Student Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Add Student" onPress={handleAddStudent} />

      <FlatList
        data={students}
        keyExtractor={(item) => item.student_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name} ({item.student_id})</Text>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteStudent(item.student_id)}>
              <Text style={styles.deleteText}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16 },
  deleteBtn: { backgroundColor: '#f44336', padding: 8, borderRadius: 6 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
