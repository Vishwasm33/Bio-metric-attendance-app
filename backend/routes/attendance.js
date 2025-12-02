const express = require('express');
const router = express.Router();
const pool = require('../db');
const PDFDocument = require('pdfkit');
const moment = require('moment');

const CLASS_LAT = 13.090769;
const CLASS_LON = 77.485700;
const RADIUS = 10;

// Distance Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const lat = (lat2 - lat1) * Math.PI / 180;
  const lon = (lon2 - lon1) * Math.PI / 180;
  return R * 2 * Math.atan2(Math.sqrt(Math.sin(lat / 2) ** 2), Math.sqrt(1 - Math.sin(lat / 2) ** 2));
}

// 📌 Mark Attendance with Geofencing
router.post('/mark', async (req, res) => {
  const { student_id, class_id, latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Location Required" });
  }

  const distance = calculateDistance(latitude, longitude, CLASS_LAT, CLASS_LON);
  console.log("📍 Distance:", distance);

  if (distance > RADIUS) {
    return res.status(403).json({ error: "Outside Allowed Area" });
  }

  try {
    await pool.query(
      "INSERT INTO attendance (student_id, class_id, timestamp) VALUES (?, ?, NOW())",
      [student_id, class_id]
    );
    res.json({ success: true, message: "Attendance Marked" });
  } catch (err) {
    res.status(500).json({ error: "Database Error" });
  }
});

// 📌 GET PDF REPORT
router.get('/pdf', async (req, res) => {
  const date = req.query.date;

  try {
    const [rows] = await pool.query(`
      SELECT s.student_id, s.name, a.class_id, a.timestamp 
      FROM attendance a 
      INNER JOIN students s ON a.student_id = s.student_id 
      WHERE DATE(a.timestamp) = ?
    `, [date]);

    if (!rows.length) {
      return res.status(404).json({ error: "No Attendance Found" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Attendance_${date}.pdf"`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(16).text(`Attendance Report — ${date}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    rows.forEach((row, i) => {
      doc.text(`${i + 1}. ${row.name} (${row.student_id}) - ${row.class_id} - ${moment(row.timestamp).format("hh:mm A")}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "PDF Failed" });
  }
});

// 📌 Analytics API
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE(timestamp) AS date, COUNT(*) AS present_count
      FROM attendance
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp) DESC
      LIMIT 7
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: "Stats Failed" });
  }
});

module.exports = router;
