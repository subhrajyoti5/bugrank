"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const storage_1 = require("../data/storage");
const router = (0, express_1.Router)();
/**
 * GET /api/challenges
 * Get all challenges
 */
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const challengesList = await storage_1.challengeDb.getAll();
        res.json({
            success: true,
            data: challengesList,
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
 * GET /api/challenges/:id
 * Get a specific challenge by ID
 */
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const challenge = await storage_1.challengeDb.findById(id);
        if (!challenge) {
            res.status(404).json({
                success: false,
                error: 'Challenge not found',
            });
            return;
        }
        res.json({
            success: true,
            data: challenge,
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
