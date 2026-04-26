import apiClient from './api';
import { RunResult, SubmitResult, ApiResponse } from '@bugpulse/shared';

export const submissionService = {
  run: async (challengeId: string, code: string, testInput?: string): Promise<RunResult> => {
    const response = await apiClient.post<ApiResponse<RunResult>>('/api/submissions/run', {
      challengeId,
      code,
      testInput,
    });
    return response.data.data!;
  },

  submit: async (challengeId: string, code: string, timeTaken: number, testInput?: string): Promise<SubmitResult> => {
    const response = await apiClient.post<ApiResponse<SubmitResult>>('/api/submissions/submit', {
      challengeId,
      code,
      timeTaken,
      testInput,
    });
    return response.data.data!;
  },

  getUserSubmissions: async (userId: string) => {
    const response = await apiClient.get<ApiResponse>(`/api/submissions/user/${userId}`);
    return response.data.data || [];
  },
};
