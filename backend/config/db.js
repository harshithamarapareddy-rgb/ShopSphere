const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    await autoSeedIfEmpty();
    return conn;
  } catch (err) {
    console.warn(`! Primary MongoDB connection failed (${err.message}).`);
    
    // In development mode, fallback to in-memory MongoDB
    try {
      console.log(' Starting in-memory MongoDB instance as fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(` In-Memory MongoDB Connected at: ${memUri}`);
      await autoSeedIfEmpty();
      return conn;
    } catch (memErr) {
      console.error(' MongoDB Connection Error: Could not connect to database.', memErr.message);
      console.error('Please make sure MongoDB is running or provide a valid MONGO_URI in .env');
      process.exit(1);
    }
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log(' Database is empty. Auto-seeding initial SHOP SPHERE demo data...');
      const seedData = require('../seeder/seed');
      await seedData(false);
    }
  } catch (e) {
    console.warn('Auto-seed warning:', e.message);
  }
};

module.exports = connectDB;
