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
  dependsOn?: string;
  endpoint: string;
  method?: string;
  refreshInterval?: number;
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
  fields?: FormField[];
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
    },

    // Reorder fields within a section
    reorderFields: (state, action: PayloadAction<{ sectionId: string; startIndex: number; endIndex: number }>) => {
      const { sectionId, startIndex, endIndex } = action.payload;

      // Find the section in the current form
      if (!state.currentForm) return;

      // Helper function to find and update a section by ID
      const updateSectionFields = (fields: FormField[]): FormField[] => {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];

          if (field.id === sectionId && field.fields) {
            const updatedFields = Array.from(field.fields);

            const [removed] = updatedFields.splice(startIndex, 1);

            updatedFields.splice(endIndex, 0, removed);

            const result = [...fields];
            result[i] = {
              ...field,
              fields: updatedFields
            };
            return result;
          }

          if (field.fields) {
            const updatedNestedFields = updateSectionFields(field.fields);
            if (updatedNestedFields !== field.fields) {
              const result = [...fields];
              result[i] = {
                ...field,
                fields: updatedNestedFields
              };
              return result;
            }
          }
        }

        return fields;
      };

      state.currentForm = {
        ...state.currentForm,
        fields: updateSectionFields(state.currentForm.fields)
      };

      const formIndex = state.forms.findIndex(form => form.formId === state.currentForm?.formId);
      if (formIndex !== -1) {
        state.forms[formIndex] = state.currentForm;
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

    // Reset form
    resetForm: (state) => {
      state.formData = {};
    },

    // Set current insurance type
    setCurrentInsuranceType: (state, action: PayloadAction<string>) => {
      state.currentInsuranceType = action.payload;

      const form = state.forms.find(form => form.formId === action.payload);
      if (form) {
        state.currentForm = form;
      }
    },
  },
});

export const {
  setForms,
  setCurrentForm,
  setFormData,
  updateFormField,
  reorderFields,
  setLoading,
  setError,
  resetForm,
  setCurrentInsuranceType,
} = formSlice.actions;

export const formReducer = formSlice.reducer; 