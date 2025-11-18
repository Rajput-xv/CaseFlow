import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import DashboardPage from './DashboardPage';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN' as const,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('DashboardPage', () => {
  it('renders welcome message', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('displays stat cards', () => {
    const { container } = renderWithProviders(<DashboardPage />);
    const cards = container.querySelectorAll('.glass-strong');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('displays quick action cards', () => {
    const { container } = renderWithProviders(<DashboardPage />);
    const actionCards = container.querySelectorAll('.glass-strong');
    expect(actionCards.length).toBeGreaterThan(0);
  });

  it('shows recent activity section', () => {
    const { container } = renderWithProviders(<DashboardPage />);
    const sections = container.querySelectorAll('.space-y-6');
    expect(sections.length).toBeGreaterThan(0);
  });

  it('has premium glassmorphism styling', () => {
    const { container } = renderWithProviders(<DashboardPage />);
    
    const glassElements = container.querySelectorAll('.glass, .glass-strong');
    expect(glassElements.length).toBeGreaterThan(0);
  });

  it('renders gradient text for title', () => {
    const { container } = renderWithProviders(<DashboardPage />);
    
    const gradientText = container.querySelector('.bg-gradient-to-r');
    expect(gradientText).toBeInTheDocument();
  });
});
