import { Router, Request, Response } from 'express';
import authService from '../services/AuthService';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
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

    const result = await authService.register({ email, password, displayName });

    res.status(201).json({
      user: result.user,
      token: result.token,
      sessionToken: result.sessionToken,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get IP and user agent for session tracking
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    const result = await authService.login({ email, password }, ipAddress, userAgent);

    res.json({
      user: result.user,
      token: result.token,
      sessionToken: result.sessionToken,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message || 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout and invalidate session
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const sessionToken = req.headers['x-session-token'] as string;

    if (sessionToken) {
      await authService.logout(sessionToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

/**
 * GET /api/auth/profile
 * Get user profile data
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const profileData = await authService.getProfileData(userId);
    res.json({ profileData });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile data' });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile data
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { profileData } = req.body;

    if (!profileData) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    await authService.updateProfileData(userId, profileData);
    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false 
}));

/**
 * GET /api/auth/google/callback
 * Google OAuth callback handler
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user) {
        return res.status(401).json({ error: 'Google authentication failed' });
      }

      // Get IP and user agent for session tracking
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');

      // Use authService to handle Google auth
      const result = await authService.googleAuth(
        {
          googleId: user.id,
          email: user.emails[0].value,
          displayName: user.displayName,
          photoURL: user.photos[0]?.value || '',
        },
        ipAddress,
        userAgent
      );

      // Redirect to frontend with token and session token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(
        `${frontendUrl}/auth-success?token=${result.token}&sessionToken=${result.sessionToken}`
      );
    } catch (error: any) {
      console.error('Google OAuth callback error:', error);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  }
);

export default router;
