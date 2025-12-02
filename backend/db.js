// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',          // MySQL runs locally
  user: 'attendance',         // 👈 the user you just created
  password: 'attendance123',  // 👈 the password you set
  database: 'attendance_db',  // 👈 your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
