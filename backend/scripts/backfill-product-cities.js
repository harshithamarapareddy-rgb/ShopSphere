const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');

dotenv.config({ path: path.join(__dirname, '../.env') });

const backfillCities = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';
    await mongoose.connect(uri);

    const products = await Product.find({
      $or: [{ city: { $exists: false } }, { city: '' }],
    }).select('_id location');

    let updated = 0;

    for (const product of products) {
      const city = (product.location || '').split(',')[0].trim();
      if (city) {
        product.city = city;
        await product.save({ validateBeforeSave: false });
        updated += 1;
      }
    }

    console.log(`Backfilled city for ${updated} product(s).`);
  } catch (error) {
    console.error('City backfill failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  backfillCities();
}

module.exports = backfillCities;
