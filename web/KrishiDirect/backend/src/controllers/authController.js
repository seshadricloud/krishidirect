import User from '../models/userModel.js';
import { createToken } from '../services/authService.js';

// Register a new user
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        const token = createToken(newUser._id);
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error.message });
    }
};

// Login an existing user
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = createToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get the profile of the logged-in user
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
    }
};