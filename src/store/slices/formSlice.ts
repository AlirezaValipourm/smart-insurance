import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for form field
 */
export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: { label: string; value: string }[];
  dependsOn?: {
    field: string;
    value: string | boolean;
  };
  validation?: {
    type: string;
    params?: any;
  }[];
}

/**
 * Interface for form section
 */
export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

/**
 * Interface for form structure
 */
export interface FormStructure {
  id: string;
  title: string;
  type: string;
  sections: FormSection[];
}

/**
 * Interface for form state
 */
interface FormState {
  formStructure: FormStructure | null;
  formData: Record<string, any>;
  loading: boolean;
  error: string | null;
  isDraft: boolean;
  currentInsuranceType: string | null;
}

/**
 * Initial state for form slice
 */
const initialState: FormState = {
  formStructure: null,
  formData: {},
  loading: false,
  error: null,
  isDraft: false,
  currentInsuranceType: null,
};

/**
 * Form slice for managing form state
 */
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    // Set form structure
    setFormStructure: (state, action: PayloadAction<FormStructure>) => {
      state.formStructure = action.payload;
    },
    
    // Set form data
    setFormData: (state, action: PayloadAction<Record<string, any>>) => {
      state.formData = action.payload;
    },
    
    // Update form field
    updateFormField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      state.formData = {
        ...state.formData,
        [action.payload.field]: action.payload.value,
      };
      state.isDraft = true;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Reset form
    resetForm: (state) => {
      state.formData = {};
      state.isDraft = false;
    },
    
    // Set current insurance type
    setCurrentInsuranceType: (state, action: PayloadAction<string>) => {
      state.currentInsuranceType = action.payload;
    },
    
    // Save draft
    saveDraft: (state) => {
      state.isDraft = true;
      // In a real app, we might save to localStorage here
    },
    
    // Clear draft
    clearDraft: (state) => {
      state.isDraft = false;
    },
  },
});

export const {
  setFormStructure,
  setFormData,
  updateFormField,
  setLoading,
  setError,
  resetForm,
  setCurrentInsuranceType,
  saveDraft,
  clearDraft,
} = formSlice.actions;

export default formSlice.reducer; 