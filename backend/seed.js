require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./model/user');
const Product = require('./model/product');
const Order = require('./model/order');

const products = [
    {
        name: 'Classic Cotton T-Shirt',
        description: 'A comfortable, lightweight cotton t-shirt for everyday wear.',
        price: 599,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        stock: 40,
        ratings: 4.5,
        numReviews: 24
    },
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Over-ear headphones with rich sound, soft ear cushions, and long battery life.',
        price: 2499,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: 18,
        ratings: 4.7,
        numReviews: 41
    },
    {
        name: 'Minimal Ceramic Coffee Mug',
        description: 'A durable ceramic mug with a clean, minimal design for coffee or tea.',
        price: 349,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
        stock: 60,
        ratings: 4.3,
        numReviews: 16
    },
    {
        name: 'Everyday Running Shoes',
        description: 'Lightweight running shoes with a cushioned sole for daily walks and workouts.',
        price: 3299,
        category: 'Footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        stock: 12,
        ratings: 4.6,
        numReviews: 32
    },
    {
        name: 'Leather Office Backpack',
        description: 'A spacious backpack with a padded laptop compartment and practical organizers.',
        price: 1899,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        stock: 25,
        ratings: 4.4,
        numReviews: 19
    },
    {
        name: 'Smart LED Desk Lamp',
        description: 'A dimmable LED desk lamp with adjustable color temperature for focused work.',
        price: 1299,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        stock: 15,
        ratings: 4.2,
        numReviews: 11
    }
];

const addresses = {
    demo: {
        fullName: 'Demo Customer',
        street: '42 Park Street',
        city: 'Pune',
        pincode: '411001',
        country: 'India'
    },
    priya: {
        fullName: 'Priya Sharma',
        street: '18 Lake View Road',
        city: 'Bengaluru',
        pincode: '560001',
        country: 'India'
    }
};

async function seedDatabase() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured in the environment.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Order.deleteMany({})
    ]);

    const password = await bcrypt.hash('Password123!', 10);
    const [, demoUser, priyaUser] = await User.create([
        {
            name: 'Store Admin',
            email: 'admin@example.com',
            password,
            role: 'admin',
            verified: true
        },
        {
            name: 'Demo Customer',
            email: 'demo@example.com',
            password,
            role: 'user',
            verified: true
        },
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            password,
            role: 'user',
            verified: true
        }
    ]);

    const createdProducts = await Product.create(products);

    const [headphones, mug, shoes] = createdProducts;
    await Order.create([
        {
            user: demoUser._id,
            product: {
                productId: headphones._id,
                quantity: 1,
                price: headphones.price
            },
            totalAmount: headphones.price,
            address: addresses.demo,
            paymentId: 'seed_payment_demo_001',
            status: 'delivered'
        },
        {
            user: priyaUser._id,
            product: {
                productId: shoes._id,
                quantity: 1,
                price: shoes.price
            },
            totalAmount: shoes.price,
            address: addresses.priya,
            paymentId: 'seed_payment_priya_001',
            status: 'shipped'
        },
        {
            user: demoUser._id,
            product: {
                productId: mug._id,
                quantity: 2,
                price: mug.price
            },
            totalAmount: mug.price * 2,
            address: addresses.demo,
            paymentId: 'seed_payment_demo_002',
            status: 'pending'
        }
    ]);

    console.log(`Seeded ${3} users, ${createdProducts.length} products, and ${3} orders.`);
    console.log('Demo login: demo@example.com / Password123!');
    console.log('Admin login: admin@example.com / Password123!');
}

seedDatabase()
    .catch((error) => {
        console.error('Database seeding failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
