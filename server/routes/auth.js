"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthService_1 = __importDefault(require("../services/AuthService"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        const result = await AuthService_1.default.register({ email, password, displayName });
        res.status(201).json({
            user: result.user,
            token: result.token,
            sessionToken: result.sessionToken,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message || 'Registration failed' });
    }
});
/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Get IP and user agent for session tracking
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');
        const result = await AuthService_1.default.login({ email, password }, ipAddress, userAgent);
        res.json({
            user: result.user,
            token: result.token,
            sessionToken: result.sessionToken,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: error.message || 'Login failed' });
    }
});
/**
 * POST /api/auth/logout
 * Logout and invalidate session
 */
router.post('/logout', auth_1.authMiddleware, async (req, res) => {
    try {
        const sessionToken = req.headers['x-session-token'];
        if (sessionToken) {
            await AuthService_1.default.logout(sessionToken);
        }
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});
/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});
/**
 * GET /api/auth/profile
 * Get user profile data
 */
router.get('/profile', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const profileData = await AuthService_1.default.getProfileData(userId);
        res.json({ profileData });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile data' });
    }
});
/**
 * PUT /api/auth/profile
 * Update user profile data
 */
router.put('/profile', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const { profileData } = req.body;
        if (!profileData) {
            return res.status(400).json({ error: 'Profile data is required' });
        }
        await AuthService_1.default.updateProfileData(userId, profileData);
        res.json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.default = router;
