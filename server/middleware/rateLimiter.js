"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLimiter = exports.submissionLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Rate limiter for code submissions
 * Limit: 15 submissions per 15 minutes per user
 */
exports.submissionLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // 15 requests per window per IP/user
    message: {
        success: false,
        error: 'Too many submissions. Please wait before trying again.',
        retryAfter: '15 minutes',
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    // Use user ID if authenticated, otherwise IP address
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },
    handler: (req, res) => {
        console.log(`⚠️ Rate limit exceeded for user: ${req.user?.id || req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many submissions. You can make 15 submissions every 15 minutes.',
            retryAfter: 900,
        });
    },
});
/**
 * More lenient rate limiter for "Run" endpoint
 * Since Run uses free AI analysis, we can be more generous
 */
exports.runLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 30, // 30 runs per 5 minutes
    message: {
        success: false,
        error: 'Too many test runs. Please wait before trying again.',
    },
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },
});
