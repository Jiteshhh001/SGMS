const express = require('express');
const auth = require('../middleware/auth');
const Grievance = require('../models/Grievance');

const router = express.Router();

// Submit grievance (POST)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const grievance = new Grievance({
      studentId: req.studentId,
      title,
      description,
      category
    });

    await grievance.save();

    res.status(201).json({
      message: 'Grievance submitted successfully',
      grievance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all grievances of logged-in student (GET)
router.get('/', auth, async (req, res) => {
  try {
    const grievances = await Grievance.find({ studentId: req.studentId });
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get grievance by ID (GET)
router.get('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check if grievance belongs to logged-in student
    if (grievance.studentId.toString() !== req.studentId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update grievance (PUT)
router.put('/:id', auth, async (req, res) => {
  try {
    let grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check if grievance belongs to logged-in student
    if (grievance.studentId.toString() !== req.studentId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { title, description, category, status } = req.body;

    if (title) grievance.title = title;
    if (description) grievance.description = description;
    if (category) grievance.category = category;
    if (status) grievance.status = status;

    await grievance.save();

    res.status(200).json({
      message: 'Grievance updated successfully',
      grievance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete grievance (DELETE)
router.delete('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check if grievance belongs to logged-in student
    if (grievance.studentId.toString() !== req.studentId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await Grievance.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search grievance by title (GET)
router.get('/search/byTitle', auth, async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: 'Please provide title parameter' });
    }

    const grievances = await Grievance.find({
      studentId: req.studentId,
      title: { $regex: title, $options: 'i' }
    });

    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
