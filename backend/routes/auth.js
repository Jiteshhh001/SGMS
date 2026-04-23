const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

function signAuthToken(studentId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ studentId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    // Check if email already exists
    let student = await Student.findOne({ email: normalizedEmail });
    if (student) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new student
    student = new Student({ name: normalizedName, email: normalizedEmail, password });
    await student.save();

    // Generate JWT token
    const token = signAuthToken(student._id);

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: { id: student._id, name: student.name, email: student.email }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if student exists
    let student = await Student.findOne({ email: normalizedEmail });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = signAuthToken(student._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      student: { id: student._id, name: student.name, email: student.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
