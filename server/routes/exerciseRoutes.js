const express = require("express");
const router = express.Router();
const { Exercise } = require("../models/Exercise");

router.get("/:userId", async (req, res) => {
  try {
    const records = await Exercise.find({ user_id: req.params.userId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exercise data", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const newRecord = new Exercise(req.body);
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error creating exercise record", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating exercise record", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Exercise record deleted", id: deleted._id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error });
  }
});

module.exports = { exerciseRoutes: router };
