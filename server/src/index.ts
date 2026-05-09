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

// Load environment variables
dotenv.config();

// Trust nginx proxy
const app: Express = express();
app.set('trust proxy', 1);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Limit each IP to 1000 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  },
});

app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    "https://bugrank-client.vercel.app",
    "https://bugrank.in",
    "https://www.bugrank.in",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-session-token"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
app.use(passport.initialize());

// API Routes
app.get('/', (req, res) => res.json({ success: true, message: 'Bugrank API' }));
app.get('/health', (req, res) => res.json({ success: true, timestamp: new Date().toISOString() }));

app.use('/api/auth', authRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🐛 Bugrank server running on port ${PORT}`);
  
  // Verify DB connection
  try {
    const count = await challengeDb.getAll();
    console.log(`✅ Connected to DB. Found ${count.length} challenges.`);
  } catch (error) {
    console.error('❌ DB Connection failed:', error);
  }

  // Session cleanup
  setInterval(async () => {
    try {
      await authService.cleanupExpiredSessions();
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }, 60 * 60 * 1000);
});

export default app;
