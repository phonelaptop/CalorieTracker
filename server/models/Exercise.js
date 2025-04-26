// models/Excercise.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true
  },
  frequency: {
    type: Number,
    required: true,
    trim: true,
  },
  hours: {
    type: Number,
    required: true,
    trim: true,
  },
  exercise_type: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true 
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = {Exercise: Exercise};
