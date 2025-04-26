const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/calorie_db');
    console.log('✅ Connected to MongoDB (calorie_db)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
