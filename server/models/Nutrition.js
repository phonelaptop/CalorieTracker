// models/UserNutrition.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const nutritionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true
  },
  carbohydrates: {
    type: Number, // in grams (g)
    required: true
  },
  fibers: {
    type: Number, // in grams (g)
    required: true
  },
  sugar: {
    type: Number, // in grams (g)
    required: true
  },
  fat: {
    type: Number, // in grams (g)
    required: true
  },
  saturated_fat: {
    type: Number, // in grams (g)
    required: true
  },
  cholesterol: {
    type: Number, // in milligrams (mg)
    required: true
  },
  sodium: {
    type: Number, // in milligrams (mg)
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = {Nutrition: Nutrition};
