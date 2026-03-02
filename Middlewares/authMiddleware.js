import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify token and attach user to request
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};