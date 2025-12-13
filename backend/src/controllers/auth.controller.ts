// auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';

// Dynamic Prisma import to avoid compilation errors
let prisma: any = null;
async function getPrisma() {
    if (!prisma) {
        try {
            const { PrismaClient } = await import('@prisma/client');
            prisma = new PrismaClient();
        } catch (err) {
            console.error('Failed to load Prisma:', err);
        }
    }
    return prisma;
}

// Controller for handling authentication-related requests
class AuthController {
    // Register a new user
    async register(req: Request, res: Response) {
        try {
            const { email, password, name, role } = req.body;

            // Validate input
            if (!email || !password || !name) {
                return res.status(400).json({ message: 'Email, password, and name are required' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }

            const db = await getPrisma();
            if (!db) {
                return res.status(500).json({ message: 'Database connection failed' });
            }

            // Check if user already exists
            const existingUser = await db.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await db.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role || 'farmer'
                }
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (err) {
            console.error('Registration error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    // Login an existing user
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const db = await getPrisma();
            if (!db) {
                return res.status(500).json({ message: 'Database connection failed' });
            }

            // Find user
            const user = await db.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (err) {
            console.error('Login error:', err);
            res.status(401).json({ message: (err as Error).message });
        }
    }

    // Get the profile of the authenticated user
    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const db = await getPrisma();
            if (!db) {
                return res.status(500).json({ message: 'Database connection failed' });
            }

            const user = await db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true
                }
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (err) {
            console.error('Profile error:', err);
            res.status(404).json({ message: (err as Error).message });
        }
    }

    // Update user profile
    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const { name, email, phone, address, profileImage } = req.body;

            const db = await getPrisma();
            if (!db) {
                return res.status(500).json({ message: 'Database connection failed' });
            }

            // Check if email is already taken by another user
            if (email) {
                const existingUser = await db.user.findFirst({
                    where: {
                        email,
                        NOT: { id: userId }
                    }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email already in use' });
                }
            }

            const user = await db.user.update({
                where: { id: userId },
                data: {
                    name,
                    email,
                    phone,
                    address,
                    profileImage
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    address: true,
                    profileImage: true,
                    createdAt: true
                }
            });

            res.json(user);
        } catch (err) {
            console.error('Update profile error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }

    // Change password
    async changePassword(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Current and new password are required' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'New password must be at least 6 characters' });
            }

            const db = await getPrisma();
            if (!db) {
                return res.status(500).json({ message: 'Database connection failed' });
            }

            const user = await db.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await db.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            res.json({ message: 'Password changed successfully' });
        } catch (err) {
            console.error('Change password error:', err);
            res.status(500).json({ message: (err as Error).message });
        }
    }
}

export const authController = new AuthController();