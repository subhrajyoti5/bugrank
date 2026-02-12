import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { Challenge } from '@bugpulse/shared';
import { challengeDb } from '../data/storage';

const router = Router();

/**
 * GET /api/challenges
 * Get all challenges
 */
router.get('/', authMiddleware, async (req: any, res: Response) => {
  try {
    const challengesList = await challengeDb.getAll();

    res.json({
      success: true,
      data: challengesList,
    });
  } catch (error: any) {
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
router.get('/:id', authMiddleware, async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const challenge = await challengeDb.findById(id);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
