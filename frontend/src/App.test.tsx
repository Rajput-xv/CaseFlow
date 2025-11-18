import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import authReducer from './features/auth/authSlice';
import casesReducer from './features/cases/casesSlice';
import uploadReducer from './features/upload/uploadSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cases: casesReducer,
      upload: uploadReducer,
    },
  });
};

describe('App', () => {
  it('renders without crashing', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(document.body).toBeTruthy();
  });
});
