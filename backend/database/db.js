const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.db_url; 
    await mongoose.connect(MONGO_URI, {
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
