const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[NEXORA DB] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[NEXORA DB] Local MongoDB connection warning: ${error.message}`);
    console.log('[NEXORA DB] Operating in dual resilience mode for seamless app demonstration.');
    return false;
  }
};

module.exports = connectDB;
