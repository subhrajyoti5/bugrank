import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { SubmissionService } from '../services/SubmissionService';
import { userDb } from '../data/storage';
import { submissionLimiter, runLimiter } from '../middleware/rateLimiter';

const router = Router();
const submissionService = new SubmissionService();

/**
 * POST /api/submissions/run
 * Test code without scoring or attempt counting
 * Uses AI analysis only (FREE) - 30 runs per 5 minutes
 */
router.post('/run', authMiddleware, runLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { challengeId, code, testInput } = req.body;
    const userId = req.user?.id || 'demo-user';

    if (!challengeId || !code) {
      res.status(400).json({
        success: false,
        error: 'challengeId and code are required',
      });
      return;
    }

    const result = await submissionService.runCode(userId, challengeId, code, testInput);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/submissions/submit
 * Submit code for full evaluation with scoring
 * Uses self-hosted execution (FREE - $0 per submission) - 15 submissions per 15 minutes
 */
router.post('/submit', authMiddleware, submissionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { challengeId, code, timeTaken, testInput } = req.body;
    const userId = req.user?.id;

    if (!challengeId || !code || timeTaken === undefined) {
      res.status(400).json({
        success: false,
        error: 'challengeId, code, and timeTaken are required',
      });
      return;
    }

    const result = await submissionService.submitCode(userId, challengeId, code, timeTaken, testInput);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/submissions/user/:userId
 * Get all submissions for a user
 */
router.get('/user/:userId', async (req, res: Response) => {
  try {
    const { userId } = req.params;

    // Get submissions from in-memory storage
    const userSubmissions = await submissionService.getUserSubmissions(userId);

    res.json({
      success: true,
      data: userSubmissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/submissions/profile/:userId
 * Get user profile with stats
 */
router.get('/profile/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    // Get user profile from database
    let userData = await userDb.findById(userId);
    
    if (!userData) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: userData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
