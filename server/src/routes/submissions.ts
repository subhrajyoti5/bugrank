import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '@/middleware/auth';
import { SubmissionService } from '@/services/SubmissionService';
import { users } from '@/data/storage';

const router = Router();
const submissionService = new SubmissionService();

/**
 * POST /api/submissions/run
 * Test code without scoring or attempt counting
 */
router.post('/run', async (req, res: Response) => {
  try {
    const { challengeId, code, testInput } = req.body;
    const userId = 'demo-user'; // No auth required

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
 */
router.post('/submit', async (req, res: Response) => {
  try {
    const { challengeId, code, timeTaken, testInput } = req.body;
    const userId = 'demo-user'; // No auth required

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
router.get('/profile/:userId', async (req, res: Response) => {
  try {
    const { userId } = req.params;

    // Get or create user profile
    let userData = users.get(userId);
    
    if (!userData) {
      // Return default profile for new users
      userData = {
        id: userId,
        email: 'demo@bugrank.com',
        displayName: 'Demo User',
        photoURL: undefined,
        createdAt: new Date(),
        totalScore: 0,
        totalSubmissions: 0,
        successfulSubmissions: 0,
      };
      users.set(userId, userData);
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
