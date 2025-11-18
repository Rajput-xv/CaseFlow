import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataGrid from './DataGrid';

describe('DataGrid Component', () => {
  const mockData = [
    {
      case_id: 'CASE-001',
      applicant_name: 'John Doe',
      dob: '1990-01-01',
      email: 'john@example.com',
      phone: '1234567890',
      category: 'TAX' as const,
      priority: 'HIGH' as const,
    },
    {
      case_id: 'CASE-002',
      applicant_name: 'Jane Smith',
      dob: '1985-05-15',
      email: 'jane@example.com',
      phone: '0987654321',
      category: 'LICENSE' as const,
      priority: 'MEDIUM' as const,
    },
  ];

  it('renders table with data', () => {
    render(<DataGrid data={mockData} errors={[]} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays case IDs correctly', () => {
    render(<DataGrid data={mockData} errors={[]} />);
    
    expect(screen.getByText('CASE-001')).toBeInTheDocument();
    expect(screen.getByText('CASE-002')).toBeInTheDocument();
  });

  it('renders empty state when no data provided', () => {
    const { container } = render(<DataGrid data={[]} errors={[]} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('applies premium styling classes', () => {
    const { container } = render(<DataGrid data={mockData} errors={[]} />);
    const tableContainer = container.querySelector('.glass-strong');
    expect(tableContainer).toBeInTheDocument();
  });

  it('displays validation errors', () => {
    const errors = [
      { row: 0, field: 'email', message: 'Invalid email format', value: 'invalid-email' },
    ];

    const { container } = render(<DataGrid data={mockData} errors={errors} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('highlights error rows with special styling', () => {
    const errors = [
      { row: 1, field: 'phone', message: 'Invalid phone number', value: 'bad-phone' },
    ];

    const { container } = render(<DataGrid data={mockData} errors={errors} />);
    const errorIndicators = container.querySelectorAll('.text-rose-400');
    expect(errorIndicators.length).toBeGreaterThan(0);
  });
});
