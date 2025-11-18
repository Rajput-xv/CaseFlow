import api from './client';
import { CaseData, ImportResult } from '@/types/case';

export const importCases = async (cases: CaseData[]): Promise<ImportResult> => {
  const response = await api.post('/cases/import', { cases });
  return response.data;
};
