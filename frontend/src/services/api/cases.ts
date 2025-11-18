import api from './client';
import { Case } from '@/types/case';

interface GetCasesParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
}

interface GetCasesResponse {
  cases: Case[];
  total: number;
  page: number;
  limit: number;
}

export const getCases = async (params: GetCasesParams): Promise<GetCasesResponse> => {
  const response = await api.get('/cases', { params });
  return response.data;
};

export const getCaseById = async (id: string): Promise<Case> => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
};

export const updateCase = async (id: string, data: Partial<Case>): Promise<Case> => {
  const response = await api.patch(`/cases/${id}`, data);
  return response.data;
};

export const deleteCase = async (id: string): Promise<void> => {
  await api.delete(`/cases/${id}`);
};
