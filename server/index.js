"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const challenges_1 = __importDefault(require("./routes/challenges"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const auth_1 = __importDefault(require("./routes/auth"));
const errorHandler_1 = require("./middleware/errorHandler");
const AuthService_1 = __importDefault(require("./services/AuthService"));
const storage_1 = require("./data/storage");
const seedChallenges_1 = require("./data/seedChallenges");
// Load environment variables
dotenv_1.default.config();
// Validate optional environment variables
if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set - AI analysis will use default responses');
}
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET not set - using default (NOT SECURE FOR PRODUCTION)');
}
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://bugrank.in', 'https://www.bugrank.in',"https://bugrank-client.vercel.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-session-token'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
// Root route
app.get('/', (req, res) => {
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
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Bugrank API is running',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/challenges', challenges_1.default);
app.use('/api/submissions', submissions_1.default);
app.use('/api/leaderboard', leaderboard_1.default);
// Error handling
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, async () => {
    console.log(`🐛 Bugrank server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Not configured (using defaults)'}`);
    console.log(`🔐 Auth: PostgreSQL + JWT enabled`);
    // Seed challenges if database is empty
    try {
        const existingChallenges = await storage_1.challengeDb.getAll();
        if (existingChallenges.length === 0) {
            console.log('📚 Seeding challenges to database...');
            for (const challenge of seedChallenges_1.seedChallenges) {
                await storage_1.challengeDb.create(challenge);
            }
            console.log(`✅ Seeded ${seedChallenges_1.seedChallenges.length} challenges`);
        }
        else {
            console.log(`✅ Found ${existingChallenges.length} challenges in database`);
        }
    }
    catch (error) {
        console.error('Error seeding challenges:', error);
    }
    // Start session cleanup job (runs every hour)
    setInterval(async () => {
        try {
            const deleted = await AuthService_1.default.cleanupExpiredSessions();
            if (deleted > 0) {
                console.log(`🧹 Cleaned up ${deleted} expired sessions`);
            }
        }
        catch (error) {
            console.error('Error cleaning up sessions:', error);
        }
    }, 60 * 60 * 1000); // 1 hour
});
exports.default = app;
