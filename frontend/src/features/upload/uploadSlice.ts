import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CaseData, ValidationError, ImportResult } from '@/types/case';
import * as uploadApi from '@/services/api/upload';

interface UploadState {
  file: File | null;
  parsedData: CaseData[];
  validationErrors: ValidationError[];
  isUploading: boolean;
  uploadProgress: number;
  importResult: ImportResult | null;
  error: string | null;
}

const initialState: UploadState = {
  file: null,
  parsedData: [],
  validationErrors: [],
  isUploading: false,
  uploadProgress: 0,
  importResult: null,
  error: null,
};

// Upload and import cases
export const importCases = createAsyncThunk(
  'upload/importCases',
  async (cases: CaseData[], { rejectWithValue }) => {
    try {
      const response = await uploadApi.importCases(cases);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Import failed');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      state.file = action.payload;
    },
    setParsedData: (state, action: PayloadAction<CaseData[]>) => {
      state.parsedData = action.payload;
    },
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
    },
    updateRow: (state, action: PayloadAction<{ index: number; data: CaseData }>) => {
      state.parsedData[action.payload.index] = action.payload.data;
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      state.parsedData.splice(action.payload, 1);
    },
    resetUpload: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importCases.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(importCases.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.importResult = action.payload;
      })
      .addCase(importCases.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFile,
  setParsedData,
  setValidationErrors,
  updateRow,
  deleteRow,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
