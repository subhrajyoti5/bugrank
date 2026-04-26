import apiClient from './api';
import { LeaderboardEntry, ApiResponse } from '@bugpulse/shared';

export const leaderboardService = {
  getTop: async (limit: number = 20): Promise<LeaderboardEntry[]> => {
    const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(`/api/leaderboard?limit=${limit}`);
    return response.data.data || [];
  },

  getUserRank: async (userId: string): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ rank: number }>>(`/api/leaderboard/rank/${userId}`);
    return response.data.data?.rank || 0;
  },
};
