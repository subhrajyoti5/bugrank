import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '@/middleware/auth';
import { LeaderboardEntry, User } from '@bugrank/shared';

// In-memory storage (replaces Firestore)
const users: Map<string, User> = new Map();

const router = Router();

/**
 * GET /api/leaderboard
 * Get top users by score
 */
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const usersList = Array.from(users.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);

    const entries: LeaderboardEntry[] = usersList.map((user, index) => ({
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
  } catch (error: any) {
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
router.get('/rank/:userId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = users.get(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Count users with higher scores
    const higherCount = Array.from(users.values())
      .filter(u => u.totalScore > user.totalScore)
      .length;

    const rank = higherCount + 1;

    res.json({
      success: true,
      data: { rank },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
