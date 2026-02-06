"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("@/middleware/auth");
const storage_1 = require("@/data/storage");
const router = (0, express_1.Router)();
/**
 * GET /api/leaderboard
 * Get top users by score
 */
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const usersList = await storage_1.userDb.getAll();
        const topUsers = usersList
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit);
        const entries = usersList.map((user, index) => ({
            rank: index + 1,
            userId: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL,
            totalScore: user.totalScore,
            successfulSubmissions: user.successfulSubmissions,
            lastUpdated: new Date(),
        }));
        res.json({
            success: true,
            data: entries,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
/**
 * GET /api/leaderboard/rank/:userId
 * Get rank for a specific user
 */
router.get('/rank/:userId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await storage_1.userDb.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        // Count users with higher scores
        const allUsers = await storage_1.userDb.getAll();
        const higherCount = allUsers
            .filter(u => u.totalScore > user.totalScore)
            .length;
        const rank = higherCount + 1;
        res.json({
            success: true,
            data: { rank },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
exports.default = router;
