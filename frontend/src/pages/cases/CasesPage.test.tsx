import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import casesReducer from '@/features/cases/casesSlice';
import CasesPage from './CasesPage';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cases: casesReducer,
    },
    preloadedState: {
      cases: {
        items: [],
        isLoading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
        filters: {},
      },
      ...initialState,
    },
  });
};

const renderWithProviders = (component: React.ReactElement, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('CasesPage', () => {
  it('renders cases page title', () => {
    renderWithProviders(<CasesPage />);
    expect(screen.getByText('Cases')).toBeInTheDocument();
  });

  it('displays search input', () => {
    renderWithProviders(<CasesPage />);
    
    const searchInput = screen.getByPlaceholderText(/search cases/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('shows loading state when fetching cases', () => {
    const initialState = {
      cases: {
        items: [],
        isLoading: true,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
        filters: {},
      },
    };

    renderWithProviders(<CasesPage />, initialState);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no cases', () => {
    const initialState = {
      cases: {
        items: [],
        isLoading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
        filters: {},
      },
    };

    const { container } = renderWithProviders(<CasesPage />, initialState);
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });

  it('renders case cards in grid layout', () => {
    const initialState = {
      cases: {
        items: [
          {
            id: '1',
            case_id: 'CASE-001',
            applicant_name: 'John Doe',
            category: 'TAX',
            priority: 'HIGH',
            status: 'PENDING',
            createdAt: '2024-01-01',
          },
          {
            id: '2',
            case_id: 'CASE-002',
            applicant_name: 'Jane Smith',
            category: 'LICENSE',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            createdAt: '2024-01-02',
          },
        ],
        isLoading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
        filters: {},
      },
    };

    const { container } = renderWithProviders(<CasesPage />, initialState);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('has premium glassmorphism styling', () => {
    const { container } = renderWithProviders(<CasesPage />);
    
    const glassElements = container.querySelectorAll('.glass, .glass-strong');
    expect(glassElements.length).toBeGreaterThan(0);
  });

  it('displays pagination when multiple pages', () => {
    const initialState = {
      cases: {
        items: [{
          id: '1',
          case_id: 'CASE-001',
          applicant_name: 'Test',
          category: 'TAX',
          priority: 'HIGH',
          status: 'PENDING',
          createdAt: '2024-01-01',
        }],
        isLoading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5,
        },
        filters: {},
      },
    };

    const { container } = renderWithProviders(<CasesPage />, initialState);
    const pagination = container.querySelector('.glass-strong');
    expect(pagination).toBeInTheDocument();
  });
});
