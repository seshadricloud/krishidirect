// filepath: KrishiDirect/KrishiDirect/backend/src/services/authService.js
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
export const register = async (userData) => {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return newUser;
};

// Login user
export const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};

// Get user profile
export const getProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export default {
    register,
    login,
    getProfile,
};