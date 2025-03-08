import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for form field option
 */
export interface FormFieldOption {
  label?: string;
  value?: string;
}

/**
 * Interface for dynamic options configuration
 */
export interface DynamicOptionsConfig {
  dependsOn: string;
  endpoint: string;
  method: string;
}

/**
 * Interface for field visibility condition
 */
export interface VisibilityCondition {
  dependsOn: string;
  condition: string;
  value: string | boolean;
}

/**
 * Interface for field validation
 */
export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
}

/**
 * Interface for form field
 */
export interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[] | FormFieldOption[];
  dynamicOptions?: DynamicOptionsConfig;
  visibility?: VisibilityCondition;
  validation?: FieldValidation;
  fields?: FormField[]; // For nested fields in groups
}

/**
 * Interface for form structure
 */
export interface FormStructure {
  formId: string;
  title: string;
  fields: FormField[];
}

/**
 * Interface for form state
 */
interface FormState {
  forms: FormStructure[];
  currentForm: FormStructure | null;
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
  forms: [],
  currentForm: null,
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
    // Set all available forms
    setForms: (state, action: PayloadAction<FormStructure[]>) => {
      state.forms = action.payload;
    },
    
    // Set current form
    setCurrentForm: (state, action: PayloadAction<FormStructure>) => {
      state.currentForm = action.payload;
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
      
      // Set the current form based on the insurance type
      const form = state.forms.find(form => form.formId === action.payload);
      if (form) {
        state.currentForm = form;
      }
    },
    
    // Save draft
    saveDraft: (state) => {
      state.isDraft = true;
    },
    
    // Clear draft
    clearDraft: (state) => {
      state.isDraft = false;
    },
  },
});

export const {
  setForms,
  setCurrentForm,
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