import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '@/middleware/auth';
import { Challenge } from '@bugrank/shared';
import { seedChallenges } from '../data/seedChallenges';
import { challenges } from '@/data/storage';

// Load seed data on startup
seedChallenges.forEach(challenge => {
  challenges.set(challenge.id, challenge);
});

console.log(`✅ Loaded ${challenges.size} challenges into memory`);

const router = Router();

/**
 * GET /api/challenges
 * Get all challenges
 */
router.get('/', async (req, res: Response) => {
  try {
    const challengesList: Challenge[] = Array.from(challenges.values())
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

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
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const challenge = challenges.get(id);

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
