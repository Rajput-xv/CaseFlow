import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Case } from '@/types/case';
import * as casesApi from '@/services/api/cases';

interface CasesState {
  cases: Case[];
  selectedCase: Case | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
  };
}

const initialState: CasesState = {
  cases: [],
  selectedCase: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  filters: {},
};

// Fetch cases with pagination and filters
export const fetchCases = createAsyncThunk(
  'cases/fetchCases',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cases: CasesState };
      const { pagination, filters } = state.cases;
      const response = await casesApi.getCases({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cases');
    }
  }
);

// Fetch single case by ID
export const fetchCaseById = createAsyncThunk(
  'cases/fetchCaseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await casesApi.getCaseById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch case');
    }
  }
);

const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setFilters: (state, action: PayloadAction<CasesState['filters']>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchCases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cases = action.payload.cases;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch case by ID
      .addCase(fetchCaseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCaseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCase = action.payload;
      })
      .addCase(fetchCaseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setFilters, clearFilters } = casesSlice.actions;
export default casesSlice.reducer;
