const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const uri = process.env.MONGO_URI ||
    (isProduction ? null : 'mongodb://127.0.0.1:27017/shopsphere');

  if (!uri) {
    console.error('MONGO_URI is missing. Please configure MongoDB Atlas.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await autoSeedIfEmpty();

    return conn;

  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);

    if (isProduction) {
      console.error('Atlas connection failed. Stopping backend.');
      process.exit(1);
    }

    try {
      console.log('Starting in-memory MongoDB for development...');

      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();

      const conn = await mongoose.connect(mongod.getUri());

      console.log('In-Memory MongoDB Connected');

      await autoSeedIfEmpty();

      return conn;

    } catch (memErr) {
      console.error('Could not connect to MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      console.log('Database is empty. Auto-seeding demo data...');

      const seedData = require('../seeder/seed');
      await seedData(false);
    }
  } catch (e) {
    console.warn('Auto-seed warning:', e.message);
  }
};

module.exports = connectDB;