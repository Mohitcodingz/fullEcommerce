require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./model/user');
const Product = require('./model/product');
const Order = require('./model/order');

const products = [
    {
        name: 'Classic Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear.',
        price: 599,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        stock: 40,
        ratings: 4.5,
        numReviews: 24
    },
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Wireless over-ear headphones with clear sound.',
        price: 2499,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        stock: 18,
        ratings: 4.7,
        numReviews: 41
    },
    {
        name: 'Ceramic Coffee Mug',
        description: 'Minimal ceramic mug for coffee and tea.',
        price: 349,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d',
        stock: 60,
        ratings: 4.3,
        numReviews: 16
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with cushioned soles.',
        price: 3299,
        category: 'Footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        stock: 12,
        ratings: 4.6,
        numReviews: 32
    },
    {
        name: 'Leather Backpack',
        description: 'Spacious backpack with a laptop compartment.',
        price: 1899,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        stock: 25,
        ratings: 4.4,
        numReviews: 19
    },
    {
        name: 'Smart LED Desk Lamp',
        description: 'Dimmable LED lamp for your workspace.',
        price: 1299,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
        stock: 15,
        ratings: 4.2,
        numReviews: 11
    }
];

async function seedDatabase() {
    try {

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in .env');
        }

        // Connect MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log('Old data deleted');

        // Hash password
        const hashedPassword = await bcrypt.hash(
            'Password123!',
            10
        );

        // Create users
        const admin = await User.create({
            name: 'Store Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            verified: true
        });

        const user1 = await User.create({
            name: 'Mohit Singh',
            email: 'mohit@example.com',
            password: hashedPassword,
            role: 'user',
            verified: true
        });

        const user2 = await User.create({
            name: 'Priya Sharma',
            email: 'priya@example.com',
            password: hashedPassword,
            role: 'user',
            verified: true
        });

        const user3 = await User.create({
            name: 'Rahul Kumar',
            email: 'rahul@example.com',
            password: hashedPassword,
            role: 'user',
            verified: true
        });

        // Create products
        const createdProducts = await Product.insertMany(products);

        const headphones = createdProducts[1];
        const mug = createdProducts[2];
        const shoes = createdProducts[3];
        const backpack = createdProducts[4];

        // Create orders
        await Order.create([

            {
                user: user1._id,

                product: {
                    productId: headphones._id,
                    quantity: 1,
                    price: headphones.price
                },

                totalAmount: headphones.price,

                address: {
                    fullName: 'Mohit Singh',
                    street: '123 Main Street',
                    city: 'New Delhi',
                    pincode: '110001',
                    country: 'India'
                },

                paymentId: 'PAY_DEMO_001',
                status: 'delivered'
            },

            {
                user: user2._id,

                product: {
                    productId: shoes._id,
                    quantity: 1,
                    price: shoes.price
                },

                totalAmount: shoes.price,

                address: {
                    fullName: 'Priya Sharma',
                    street: '18 Lake View Road',
                    city: 'Bengaluru',
                    pincode: '560001',
                    country: 'India'
                },

                paymentId: 'PAY_DEMO_002',
                status: 'shipped'
            },

            {
                user: user1._id,

                product: {
                    productId: mug._id,
                    quantity: 2,
                    price: mug.price
                },

                totalAmount: mug.price * 2,

                address: {
                    fullName: 'Mohit Singh',
                    street: '123 Main Street',
                    city: 'New Delhi',
                    pincode: '110001',
                    country: 'India'
                },

                paymentId: 'PAY_DEMO_003',
                status: 'pending'
            },

            {
                user: user3._id,

                product: {
                    productId: backpack._id,
                    quantity: 1,
                    price: backpack.price
                },

                totalAmount: backpack.price,

                address: {
                    fullName: 'Rahul Kumar',
                    street: '45 MG Road',
                    city: 'Mumbai',
                    pincode: '400001',
                    country: 'India'
                },

                paymentId: 'PAY_DEMO_004',
                status: 'delivered'
            }

        ]);

        console.log('');
        console.log('================================');
        console.log('DATABASE SEEDED SUCCESSFULLY');
        console.log('================================');

        console.log('Users: 4');
        console.log(`Products: ${createdProducts.length}`);
        console.log('Orders: 4');

        console.log('');
        console.log('Admin Login:');
        console.log('Email: admin@example.com');
        console.log('Password: Password123!');

        console.log('');
        console.log('User Login:');
        console.log('Email: mohit@example.com');
        console.log('Password: Password123!');

    } catch (error) {

        console.error('Seeding failed:', error.message);

    } finally {

        await mongoose.connection.close();

        console.log('MongoDB connection closed');

    }
}

seedDatabase();