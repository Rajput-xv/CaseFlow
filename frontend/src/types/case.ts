import { z } from 'zod';

// Case schema - defines the structure and validation rules for case data
export const caseSchema = z.object({
  case_id: z.string().min(1, 'Case ID is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  dob: z.string().refine(
    (date) => {
      const d = new Date(date);
      const minDate = new Date('1900-01-01');
      const maxDate = new Date();
      return d >= minDate && d <= maxDate;
    },
    { message: 'Date of birth must be between 1900 and today' }
  ),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid E.164 phone format')
    .optional()
    .or(z.literal('')),
  category: z.enum(['TAX', 'LICENSE', 'PERMIT'], {
    message: 'Category must be TAX, LICENSE, or PERMIT',
  }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
});

export type CaseData = z.infer<typeof caseSchema>;

export interface Case extends CaseData {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: string;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: ValidationError[];
  cases: Case[];
}
