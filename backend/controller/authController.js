
const user = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30h' })
}
async function registerUser(req, res) {
    try {

        const { name, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // TODO: otp sending verification after registration
        // TODO: welcome Email after registration
        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = new user({
            name: name,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
            const message = `Welcome ${newUser.name}! Your OTP for email verification is: ${otp}`;
            await sendEmail(email, 'Email Verification', message);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id),
                message: 'User registered successfully. Please check your email for verification.'
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}
// checking if the users exits -> store in hashed password -> saving the new userin the database -> generating a jwt token  while sending welcome email to the (token function , sendEmail fucntion which is using nodemailer.)
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        else {
            const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
            if (isPasswordValid) {
                res.status(200).json({
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                    token: generateToken(existingUser._id)
                });
            } else {
                res.status(400).json({ message: 'Invalid email or password' });
            }
        }
    }
    catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function getUser(req, res) {
    try {
        const newUser = await user.find({}).select('-password');
        res.json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
module.exports = { registerUser, loginUser, getUser };