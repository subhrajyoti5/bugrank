import apiClient from './api';
import { RunResult, SubmitResult, ApiResponse } from '@bugrank/shared';

export const submissionService = {
  run: async (challengeId: string, code: string): Promise<RunResult> => {
    const response = await apiClient.post<ApiResponse<RunResult>>('/api/submissions/run', {
      challengeId,
      code,
    });
    return response.data.data!;
  },

  submit: async (challengeId: string, code: string, timeTaken: number): Promise<SubmitResult> => {
    const response = await apiClient.post<ApiResponse<SubmitResult>>('/api/submissions/submit', {
      challengeId,
      code,
      timeTaken,
    });
    return response.data.data!;
  },

  getUserSubmissions: async (userId: string) => {
    const response = await apiClient.get<ApiResponse>(`/api/submissions/user/${userId}`);
    return response.data.data || [];
  },
};
