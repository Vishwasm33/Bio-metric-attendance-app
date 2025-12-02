// routes/auth.js
const express = require('express');
const router = express.Router();

/**
 * Dummy Login API — replace with DB later
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Example login credentials
  const validUser = "teacher";
  const validPass = "1234";

  if (username === validUser && password === validPass) {
    return res.json({
      success: true,
      user: { username, role: "teacher" }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
});

module.exports = router;
