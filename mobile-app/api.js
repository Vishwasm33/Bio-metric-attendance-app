// api.js
import axios from 'axios';

const BASE = 'http://192.168.1.9:4000'; // 👈 Update to your correct IP

// 🧩 Fetch all students
export const fetchStudents = async () => {
  const res = await axios.get(`${BASE}/students`);
  return res.data;
};

// 🧩 Mark attendance with geolocation
export const markAttendance = async (student_id, class_id, latitude, longitude) => {
  try {
    const res = await axios.post(`${BASE}/attendance/mark`, {
      student_id,
      class_id,
      latitude,
      longitude,
    });
    return res.data;
  } catch (err) {
    console.error('Attendance Error:', err);
    throw err;
  }
};

// 🧩 Add student
export const registerStudent = async (student_id, name, class_id) => {
  const res = await axios.post(`${BASE}/students/add`, {
    student_id,
    name,
    class_id,
  });
  return res.data;
};

// 🧩 Delete student
export const deleteStudent = async (student_id) => {
  const res = await axios.delete(`${BASE}/students/delete/${student_id}`);
  return res.data;
};

// 🧩 Download PDF
export const downloadPdfUrl = (date) => `${BASE}/attendance/pdf?date=${date}`;

// 🧩 Attendance Stats
export const fetchAttendanceStats = async () => {
  const res = await axios.get(`${BASE}/attendance/stats`);
  return res.data;
};

// 🔐 LOGIN API — Teacher/Admin Login
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${BASE}/auth/login`, {
      username,
      password,
    });
    return res.data; // -> success + user role
  } catch (err) {
    console.error("Login API Error:", err);
    throw err;
  }
};
