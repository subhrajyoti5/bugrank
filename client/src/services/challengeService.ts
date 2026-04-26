import apiClient from './api';
import { Challenge, ApiResponse } from '@bugpulse/shared';

export const challengeService = {
  getAll: async (): Promise<Challenge[]> => {
    const response = await apiClient.get<ApiResponse<Challenge[]>>('/api/challenges');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Challenge | null> => {
    const response = await apiClient.get<ApiResponse<Challenge>>(`/api/challenges/${id}`);
    return response.data.data || null;
  },
};
