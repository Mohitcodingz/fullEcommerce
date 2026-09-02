const jwt = require('jsonwebtoken');
const user = require('../model/user');
// protect middleware to verify JWT token and authenticate user
const protect = async (req, res, next) => {
    if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')) {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.id).select('-password');
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
}
const admin = async (req, res, next) => {

};
module.exports = { protect, admin };