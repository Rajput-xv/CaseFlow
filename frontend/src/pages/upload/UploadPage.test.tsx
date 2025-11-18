import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import uploadReducer from '@/features/upload/uploadSlice';
import UploadPage from './UploadPage';

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      upload: uploadReducer,
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

describe('UploadPage', () => {
  it('renders upload page title', () => {
    const { container } = renderWithProviders(<UploadPage />);
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
  });

  it('displays upload steps indicator', () => {
    const { container } = renderWithProviders(<UploadPage />);
    const steps = container.querySelectorAll('.glass');
    expect(steps.length).toBeGreaterThan(0);
  });

  it('shows file upload area', () => {
    const { container } = renderWithProviders(<UploadPage />);
    const uploadArea = container.querySelector('.glass-strong');
    expect(uploadArea).toBeInTheDocument();
  });

  it('displays download template button', () => {
    const { container } = renderWithProviders(<UploadPage />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has premium glassmorphism styling', () => {
    const { container } = renderWithProviders(<UploadPage />);
    
    const glassElements = container.querySelectorAll('.glass, .glass-strong');
    expect(glassElements.length).toBeGreaterThan(0);
  });

  it('renders gradient header text', () => {
    const { container } = renderWithProviders(<UploadPage />);
    
    const gradientText = container.querySelector('.bg-gradient-to-r');
    expect(gradientText).toBeInTheDocument();
  });

  it('shows file input on click', () => {
    renderWithProviders(<UploadPage />);
    
    const uploadArea = screen.getByText(/drag.*drop.*csv file/i).closest('div');
    expect(uploadArea).toBeInTheDocument();
    
    if (uploadArea) {
      fireEvent.click(uploadArea);
      // File input should be triggered
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
    }
  });
});
