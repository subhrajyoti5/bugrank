"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.authMiddleware = void 0;
const AuthService_1 = __importDefault(require("../services/AuthService"));
/**
 * Middleware to authenticate requests using JWT or session token
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Try JWT token from Authorization header first
        const authHeader = req.headers.authorization;
        let user = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = AuthService_1.default.verifyToken(token);
                user = await AuthService_1.default.getUserById(decoded.userId);
            }
            catch (error) {
                // JWT validation failed, try session token
            }
        }
        // If JWT failed or not provided, try session token
        if (!user) {
            const sessionToken = req.headers['x-session-token'];
            if (sessionToken) {
                user = await AuthService_1.default.validateSession(sessionToken);
            }
        }
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized - Invalid or expired token',
            });
            return;
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Unauthorized - Authentication failed',
        });
    }
};
exports.authMiddleware = authMiddleware;
// Export for backward compatibility
exports.authenticateToken = exports.authMiddleware;
