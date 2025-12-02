// index.js
const authRoutes = require('./routes/auth');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const studentsRouter = require('./routes/students');
const attendanceRouter = require('./routes/attendance');
const authRouter = require('./routes/auth');   // ✅ Added this line

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/students', studentsRouter);
app.use('/attendance', attendanceRouter);
app.use('/auth', authRouter);  // ✅ Added this line

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
