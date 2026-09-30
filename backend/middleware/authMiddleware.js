const jwt = require('jsonwebtoken');
const user = require('../model/user');
// protect middleware to verify JWT token and authenticate user
const protect = async (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization;
    if (header && header.startsWith('Bearer ')) {
        try {
            const token = header.split(' ')[1];
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET is not set.' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const found = await user.findById(decoded.id).select('-password -otp -otpExpires');
            if (!found) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            req.user = found;
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    }
    return res.status(401).json({ message: 'Not authorized, no token' });
};
 
module.exports = { protect };