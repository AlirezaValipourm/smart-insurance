import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for a submission item
 */
export interface SubmissionItem {
  id: string;
  [key: string]: any;
}

/**
 * Interface for submissions state
 */
interface SubmissionsState {
  data: SubmissionItem[];
  columns: string[];
  visibleColumns: string[];
  loading: boolean;
  error: string | null;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

/**
 * Initial state for submissions slice
 */
const initialState: SubmissionsState = {
  data: [],
  columns: [],
  visibleColumns: [],
  loading: false,
  error: null,
  sortBy: null,
  sortDirection: 'asc',
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
};

/**
 * Submissions slice for managing submissions data
 */
const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    // Set submissions data
    setSubmissions: (state, action: PayloadAction<{ data: SubmissionItem[]; columns: string[]; totalItems: number }>) => {
      state.data = action.payload.data;
      state.columns = action.payload.columns;
      state.totalItems = action.payload.totalItems;
      
      // If visibleColumns is empty, set it to all columns
      if (state.visibleColumns.length === 0) {
        state.visibleColumns = action.payload.columns;
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Set visible columns
    setVisibleColumns: (state, action: PayloadAction<string[]>) => {
      state.visibleColumns = action.payload;
    },
    
    // Toggle column visibility
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = action.payload;
      if (state.visibleColumns.includes(column)) {
        state.visibleColumns = state.visibleColumns.filter(col => col !== column);
      } else {
        state.visibleColumns = [...state.visibleColumns, column];
      }
    },
    
    // Set sort parameters
    setSort: (state, action: PayloadAction<{ sortBy: string; sortDirection: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    
    // Set search term
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    
    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    // Set items per page
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
  },
});

export const {
  setSubmissions,
  setLoading,
  setError,
  setVisibleColumns,
  toggleColumnVisibility,
  setSort,
  setSearchTerm,
  setCurrentPage,
  setItemsPerPage,
} = submissionsSlice.actions;

export const submissionsReducer = submissionsSlice.reducer; 