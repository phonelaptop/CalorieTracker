const express = require('express');
const router = express.Router();
const { Nutrition } = require("../models/Nutrition");

// GET all nutrition records for a user
router.get('/:userId', async (req, res) => {
  try {

    const records = await Nutrition.find({ user_id: req.params.userId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nutrition data', error });
  }
});

// CREATE a new nutrition record
router.post('/', async (req, res) => {
  try {
    const newRecord = new Nutrition(req.body);
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating nutrition record', error });
  }
});

// UPDATE a nutrition record by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Nutrition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating nutrition record', error });
  }
});
  
// DELETE a nutrition record by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Nutrition.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Nutrition record deleted', id: deleted._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record', error });
  }
});

module.exports = { nutritionRoutes: router };
