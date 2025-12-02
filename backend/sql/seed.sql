-- seed.sql (sample students)
USE attendance_db;
INSERT IGNORE INTO students (student_id, name) VALUES
('S001','Alice'),
('S002','Bob'),
('S003','Charlie');
