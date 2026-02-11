import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import challengesRouter from './routes/challenges';
import submissionsRouter from './routes/submissions';
import leaderboardRouter from './routes/leaderboard';
import authRouter from './routes/auth';
import { errorHandler, notFound } from './middleware/errorHandler';
import authService from './services/AuthService';
import { challengeDb } from './data/storage';
import { seedChallenges } from './data/seedChallenges';

// Load environment variables
dotenv.config();

// Validate optional environment variables
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set - AI analysis will use default responses');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set - using default (NOT SECURE FOR PRODUCTION)');
}

// Check execution environment
if (process.env.NODE_ENV !== 'production') {
  console.log('\n' + '='.repeat(70));
  console.log('🔧 DEVELOPMENT MODE - Code Execution');
  console.log('='.repeat(70));
  console.log('⚠️  Self-hosted execution requires VPS setup (Phases 0-3)');
  console.log('📝 Running locally will show "System Error" for code execution');
  console.log('✅ AI analysis will still work for development');
  console.log('📖 See: SYSTEM_ERROR_TROUBLESHOOTING.md for details');
  console.log('🚀 Deploy to VPS for full execution functionality');
  console.log('='.repeat(70) + '\n');
}

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;


// CORS configuration
const corsOptions = {
  origin: [
    "https://bugrank-client.vercel.app",
    "https://bugrank.in",
    "https://www.bugrank.in",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-session-token"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(
helmet(
{
    crossOriginResourcePolicy: false,
  }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Return the profile for use in the callback route
      return done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Initialize Passport without sessions (using custom JWT sessions)
app.use(passport.initialize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Bugrank API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      challenges: '/api/challenges',
      submissions: '/api/submissions',
      leaderboard: '/api/leaderboard',
    },
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Bugrank API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/leaderboard', leaderboardRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`🐛 Bugrank server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured (using defaults)'}`);
  console.log(`🔐 Auth: PostgreSQL + JWT enabled`);
  
  // Seed challenges if database is empty
  try {
    const existingChallenges = await challengeDb.getAll();
    if (existingChallenges.length === 0) {
      console.log('📚 Seeding challenges to database...');
      for (const challenge of seedChallenges) {
        await challengeDb.create(challenge);
      }
      console.log(`✅ Seeded ${seedChallenges.length} challenges`);
    } else {
      console.log(`✅ Found ${existingChallenges.length} challenges in database`);
    }
  } catch (error) {
    console.error('Error seeding challenges:', error);
  }
  
  // Start session cleanup job (runs every hour)
  setInterval(async () => {
    try {
      const deleted = await authService.cleanupExpiredSessions();
      if (deleted > 0) {
        console.log(`🧹 Cleaned up ${deleted} expired sessions`);
      }
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
});

export default app;
