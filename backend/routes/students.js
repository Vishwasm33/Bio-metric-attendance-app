// routes/students.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all students
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ADD student with section/class_id
router.post('/add', async (req, res) => {
  const { student_id, name, class_id } = req.body;

  if (!student_id || !name || !class_id) {
    return res.status(400).json({ error: 'student_id, name, class_id required' });
  }

  try {
    await pool.query(
      'INSERT INTO students (student_id, name, class_id) VALUES (?, ?, ?)',
      [student_id, name, class_id]
    );
    res.json({ success: true, message: 'Student added successfully' });
  } catch (err) {
    console.error('Error inserting student:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Student ID already exists' });
    }
    res.status(500).json({ error: 'Failed to insert student' });
  }
});

// DELETE student
router.delete('/delete/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM students WHERE student_id = ?',
      [student_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
