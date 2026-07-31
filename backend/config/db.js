const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/veloura', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Veloura DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Veloura DB] Local MongoDB connection warning: ${error.message}`);
    console.log('[Veloura DB] Operating in dual resilience mode for seamless app demonstration.');
    return false;
  }
};

module.exports = connectDB;
