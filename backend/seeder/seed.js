const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const City = require('../models/City');
const Product = require('../models/Product');
const Interest = require('../models/Interest');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async (shouldExit = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';
      try {
        await mongoose.connect(uri);
      } catch (err) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
      }
    }

    console.log(' Clearing existing database collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await City.deleteMany({});
    await Product.deleteMany({});
    await Interest.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log(' Creating Users, Sellers, Shops, and Admin accounts (India Region)...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
      phone: '+91 98765 43210',
      address: {
        street: '100 Tech Park, MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
      },
    });

    // 2. Create Sellers
    const seller1 = await User.create({
      name: 'Vikram Malhotra',
      email: 'seller@shopsphere.com',
      password: 'Seller@123',
      role: 'seller',
      isEmailVerified: true,
      phone: '+91 98450 12345',
      sellerProfile: {
        shopName: 'ElectroSphere Tech & Audio',
        shopDescription: 'Certified electronics, laptops, computer components, and premium audio equipment.',
        businessPhone: '+91 98450 12345',
        businessEmail: 'support@electrosphere.in',
        address: '45 Indiranagar 100ft Road, Bengaluru, Karnataka',
        rating: 4.9,
        isVerified: true,
      },
    });

    const seller2 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'ananya@vintageliving.in',
      password: 'Seller@123',
      role: 'seller',
      isEmailVerified: true,
      phone: '+91 99200 54321',
      sellerProfile: {
        shopName: 'Urban Artisan & Living',
        shopDescription: 'Solid wood ergonomic furniture, handcrafted decor, and vintage collectibles.',
        businessPhone: '+91 99200 54321',
        businessEmail: 'hello@urbanartisan.in',
        address: '88 Linking Road, Bandra West, Mumbai',
        rating: 4.8,
        isVerified: true,
      },
    });

    // 3. Create Shop Account
    const shop1 = await User.create({
      name: 'Kabir Nair',
      email: 'shop@shopsphere.com',
      password: 'Shop@123',
      role: 'shop',
      isEmailVerified: true,
      phone: '+91 90000 11223',
      sellerProfile: {
        shopName: 'Nair Mobile & Gadget World',
        shopDescription: 'Authorised smartphone, tablet, smartwatch and accessory retailer.',
        businessPhone: '+91 90000 11223',
        businessEmail: 'hello@nairmobiles.in',
        address: '7 Brigade Road, Bengaluru, Karnataka',
        city: 'Bengaluru',
        category: 'Mobile & Gadgets',
        rating: 4.7,
        isVerified: true,
      },
    });

    // 4. Create Regular Users
    const user1 = await User.create({
      name: 'Rahul Sharma',
      email: 'john@example.com',
      password: 'User@123',
      role: 'user',
      isEmailVerified: true,
      phone: '+91 98111 22334',
      address: {
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560103',
        country: 'India',
      },
    });

    const user2 = await User.create({
      name: 'Priya Patel',
      email: 'sarah@example.com',
      password: 'User@123',
      role: 'user',
      isEmailVerified: true,
      phone: '+91 97222 33445',
      address: {
        street: '12 Palm Beach Road, Vashi',
        city: 'Navi Mumbai',
        state: 'Maharashtra',
        zipCode: '400703',
        country: 'India',
      },
    });

    console.log(' Creating Cities...');
    const citiesData = [
      { name: 'Bengaluru', state: 'Karnataka' },
      { name: 'Mumbai', state: 'Maharashtra' },
      { name: 'Pune', state: 'Maharashtra' },
      { name: 'Hyderabad', state: 'Telangana' },
      { name: 'New Delhi', state: 'Delhi' },
      { name: 'Chennai', state: 'Tamil Nadu' },
      { name: 'Kolkata', state: 'West Bengal' },
      { name: 'Ahmedabad', state: 'Gujarat' },
      { name: 'Jaipur', state: 'Rajasthan' },
      { name: 'Lucknow', state: 'Uttar Pradesh' },
    ];
    await City.insertMany(citiesData);

    console.log(' Creating Categories...');
    const categoriesData = [
      {
        name: 'Electronics & Computers',
        description: 'Laptops, gaming consoles, monitors, computer parts, and home audio systems.',
        icon: 'FaLaptop',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Mobile & Gadgets',
        description: 'Smartphones, smartwatches, tablets, wireless headphones, and accessories.',
        icon: 'FaMobileAlt',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Home & Furniture',
        description: 'Ergonomic chairs, desks, lighting, kitchen appliances, and interior decor.',
        icon: 'FaCouch',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Fashion & Apparel',
        description: 'Designer apparel, shoes, ethnic wear, leather goods, and timeless accessories.',
        icon: 'FaTshirt',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Vehicles & Motors',
        description: 'Motorcycles, cars, electric two-wheelers, auto parts, and riding accessories.',
        icon: 'FaCar',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Books & Hobbies',
        description: 'Bestselling novels, collectible comic books, musical instruments, and crafts.',
        icon: 'FaBook',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Sports & Outdoors',
        description: 'Bicycles, gym equipment, cricket kits, running shoes, and fitness tech.',
        icon: 'FaFutbol',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
      },
      {
        name: 'Real Estate & Property',
        description: 'Commercial spaces, luxury apartments, rental listings, and plots across India.',
        icon: 'FaHome',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    console.log(' Creating Products across multiple categories with INR (₹) pricing...');
    const productsData = [
      {
        name: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
        description: 'Space Black MacBook Pro 16-inch with M3 Max chip. Includes original box, 140W MagSafe charger, and AppleCare+ warranty valid in India.',
        price: 249900,
        originalPrice: 289900,
        category: catMap['Electronics & Computers'],
        seller: seller1._id,
        condition: 'Like New',
        location: 'Bengaluru, Karnataka',
        availabilityStatus: 'In Stock',
        stockQuantity: 4,
        isFeatured: true,
        views: 340,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        description: 'Industry-leading noise cancellation with 8 microphones, 30-hour battery life, and high-res audio support. Comes with original protective carry case and bill.',
        price: 26990,
        originalPrice: 34990,
        category: catMap['Electronics & Computers'],
        seller: seller1._id,
        condition: 'Brand New',
        location: 'Bengaluru, Karnataka',
        availabilityStatus: 'In Stock',
        stockQuantity: 12,
        isFeatured: true,
        views: 620,
        images: [
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)',
        description: 'Official Indian retail unit with built-in S-Pen, 200MP camera system, Snapdragon 8 Gen 3, and titanium chassis. Screen protector applied from day one.',
        price: 114999,
        originalPrice: 139999,
        category: catMap['Mobile & Gadgets'],
        seller: seller1._id,
        condition: 'Used - Excellent',
        location: 'Hyderabad, Telangana',
        availabilityStatus: 'In Stock',
        stockQuantity: 5,
        isFeatured: true,
        views: 450,
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Herman Miller Aeron Ergonomic Office Chair (Size B)',
        description: 'Authentic Herman Miller Aeron Chair with PostureFit SL, fully adjustable arms, forward tilt limiter, and breathable pellicle mesh. Ideal for work from home.',
        price: 78500,
        originalPrice: 115000,
        category: catMap['Home & Furniture'],
        seller: seller2._id,
        condition: 'Used - Excellent',
        location: 'Mumbai, Maharashtra',
        availabilityStatus: 'In Stock',
        stockQuantity: 2,
        isFeatured: true,
        views: 510,
        images: [
          'https://images.unsplash.com/photo-1580481077195-c328865c7921?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Solid Sheesham Wood 6-Seater Dining Table & Chairs',
        description: 'Handcrafted premium Indian Sheesham wood dining table set with warm honey finish. Highly durable, termite-treated with 6 cushioned chairs.',
        price: 34999,
        originalPrice: 48000,
        category: catMap['Home & Furniture'],
        seller: seller2._id,
        condition: 'Brand New',
        location: 'Pune, Maharashtra',
        availabilityStatus: 'In Stock',
        stockQuantity: 3,
        isFeatured: false,
        views: 210,
        images: [
          'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Men’s Handcrafted Pure Leather Biker Jacket (Size L)',
        description: '100% genuine full-grain leather motorcycle jacket with YKK brass zippers and quilted thermal lining. Worn only during two rides, pristine condition.',
        price: 6499,
        originalPrice: 11999,
        category: catMap['Fashion & Apparel'],
        seller: seller2._id,
        condition: 'Used - Excellent',
        location: 'Mumbai, Maharashtra',
        availabilityStatus: 'In Stock',
        stockQuantity: 2,
        isFeatured: false,
        views: 190,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Trek Domane AL 4 Disc Endurance Road Bike (54cm)',
        description: 'Lightweight aluminium road frame with carbon fork, Shimano Tiagra 20-speed drivetrain, and hydraulic disc brakes. Perfect for long weekend rides and city commutes.',
        price: 89000,
        originalPrice: 125000,
        category: catMap['Sports & Outdoors'],
        seller: seller1._id,
        condition: 'Used - Good',
        location: 'Bengaluru, Karnataka',
        availabilityStatus: 'In Stock',
        stockQuantity: 1,
        isFeatured: true,
        views: 380,
        images: [
          'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Royal Enfield Continental GT 650 (Dux Deluxe, 6,500 Km)',
        description: 'Single owner, pristine café racer with dual ABS, spoke wheels, AEW exhaust fitted (stock pipes included), and comprehensive insurance valid till late 2027.',
        price: 295000,
        originalPrice: 360000,
        category: catMap['Vehicles & Motors'],
        seller: seller1._id,
        condition: 'Used - Excellent',
        location: 'Bengaluru, Karnataka',
        availabilityStatus: 'In Stock',
        stockQuantity: 1,
        isFeatured: true,
        views: 920,
        images: [
          'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        name: 'Fender Player Stratocaster Electric Guitar (Buttercream)',
        description: 'Authentic Fender Player Series Strat with alder body, 3 Player Series Alnico 5 single-coils, maple neck, and 2-point tremolo bridge. Includes Fender padded gig bag.',
        price: 58500,
        originalPrice: 72000,
        category: catMap['Books & Hobbies'],
        seller: seller2._id,
        condition: 'Like New',
        location: 'New Delhi, Delhi',
        availabilityStatus: 'In Stock',
        stockQuantity: 2,
        isFeatured: false,
        views: 310,
        images: [
          'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&auto=format&fit=crop&q=80',
        ],
      },
    ];

    const productsWithCities = productsData.map((product) => ({
      ...product,
      city: product.city || product.location.split(',')[0].trim(),
    }));

    const createdProducts = await Product.insertMany(productsWithCities);

    console.log(' Creating Sample Interested Buyers...');
    await Interest.create({
      user: user1._id,
      product: createdProducts[1]._id,
      seller: seller1._id,
      message: 'Is this still available? I can pick it up this weekend.',
      phone: user1.phone,
      status: 'Pending',
    });

    await Interest.create({
      user: user2._id,
      product: createdProducts[3]._id,
      seller: seller2._id,
      message: 'Interested in the chair. Can you share the final price?',
      phone: user2.phone,
      status: 'Contacted',
      contactedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });

    console.log('SHOP SPHERE Database Seeded Successfully with INR (₹)!');
    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = seedData;
