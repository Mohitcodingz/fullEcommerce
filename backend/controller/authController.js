
const user = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in environment variables.');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30h' });
};
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await user.findOne({ email: normalizedEmail });
        if (existingUser?.verified) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }
        const isNewUser = !existingUser;
        const newUser = existingUser || new user({
            name: name.trim(),
            email: normalizedEmail,
            password: bcrypt.hashSync(password, 10),
        });
        if (!isNewUser) {
            newUser.name = name.trim() || newUser.name;
            newUser.password = bcrypt.hashSync(password, 10);
        }
        if (isNewUser) await newUser.save();
        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            const hashedOtp = bcrypt.hashSync(otp.toString(), 10);
            newUser.otp = hashedOtp;
            newUser.otpExpires = otpExpires;
            await newUser.save();
            const message = `Welcome ${newUser.name}! Your OTP for email verification is: ${otp}. It expires in 10 minutes.`;
            try {
                await sendEmail(normalizedEmail, 'Email Verification - Your OTP Code', message);
            } catch (emailError) {
                console.error('Registration email delivery failed:', emailError.code || emailError.message);
                const isConfigError = emailError.code === 'EMAIL_NOT_CONFIGURED';
                return res.status(503).json({
                    message: isConfigError
                        ? 'Email service is not configured on the server. Please contact support.'
                        : 'Could not send the verification email. Please try again in a moment.'
                });
            }
            // DO NOT return token here - user must verify OTP first
            return res.status(isNewUser ? 201 : 200).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                message: isNewUser
                    ? 'User registered successfully. Please check your email for verification OTP.'
                    : 'Verification email sent. Please check your inbox.'
            });
        }
        return res.status(400).json({ message: 'Invalid user data' });
    } catch (error) {
        console.error('registerUser error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required.' });
        }
        const userEmail = await user.findOne({ email: email.toLowerCase().trim() });
        if (!userEmail) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userEmail.verified) {
            return res.status(200).json({
                message: 'Email already verified. Please login.',
                _id: userEmail._id,
                name: userEmail.name,
                email: userEmail.email,
                role: userEmail.role,
                token: generateToken(userEmail._id)
            });
        }
        if (!userEmail.otp || !userEmail.otpExpires) {
            return res.status(400).json({ message: 'No OTP found. Please register again.' });
        }

        // Check if OTP is expired
        if (new Date() > userEmail.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired. Please register again to get a new code.' });
        }

        const compareOtp = bcrypt.compareSync(String(otp).trim(), userEmail.otp);
        if (compareOtp) {
            userEmail.verified = true;
            userEmail.otp = undefined;
            userEmail.otpExpires = undefined;
            await userEmail.save();

            // Now issue token after verification
            return res.status(200).json({
                message: 'OTP verified successfully',
                _id: userEmail._id,
                name: userEmail.name,
                email: userEmail.email,
                role: userEmail.role,
                token: generateToken(userEmail._id)
            });
        }
        return res.status(400).json({ message: 'Invalid OTP. Please check the code and try again.' });
    } catch (error) {
        console.error('verifyOtp error:', error);
        return res.status(500).json({
            message: 'Error occurred',
            error: error.message
        });
    }
}
// checking if the users exits -> store in hashed password -> saving the new userin the database -> generating a jwt token  while sending welcome email to the (token function , sendEmail fucntion which is using nodemailer.)
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const existingUser = await user.findOne({ email: email.toLowerCase().trim() });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (!existingUser.verified) {
            return res.status(403).json({
                message: 'Please verify your email with the OTP sent to your inbox before logging in.',
                needsVerification: true,
                email: existingUser.email
            });
        }
        return res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token: generateToken(existingUser._id)
        });
    }
    catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function getUser(req, res) {
    try {
        const newUser = await user.find({}).select('-password -otp -otpExpires');
        res.json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { registerUser, loginUser, getUser ,verifyOtp};
