'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useFormData } from '../../hooks/useFormData';
import { useFormValidation } from '../../hooks/useFormValidation';
import { RootState } from '../../store';
import { FormField as FormFieldType, FormStructure, resetForm } from '../../store/slices/formSlice';
import { FormSection } from './FormSection';

interface DynamicFormProps {
  formId: string;
}

/**
 * Dynamic form component that renders a form based on the form structure
 * @param formId - The ID of the form to render
 * @returns The dynamic form component
 */
export function DynamicForm({ formId }: DynamicFormProps) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isReorderingEnabled, setIsReorderingEnabled] = useState(false);

  // Get form data from Redux and React Query
  const { formData } = useSelector((state: RootState) => state.form);
  const { currentForm, isLoading, error, submitForm, isSubmitting, submitError } = useFormData(formId);

  // Get the validation schema from the hook
  const { zodSchema } = useFormValidation();
  
  // Use the dynamic schema from the validation hook
  const methods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: formData,
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState: { isValid } } = methods;

  // Update form values when formData changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      reset(formData);
    }
  }, [formData, reset]);

  // Handle form submission
  const onSubmit = (data: Record<string, any>) => {
    const processedData = processFormData(data, currentForm || null);

    const submissionData = {
      ...processedData,
      formId,
      submittedAt: new Date().toISOString(),
    };

    submitForm(submissionData, {
      onSuccess: () => {
        setIsSubmitted(true);
        setOpenSnackbar(true);
        dispatch(resetForm());
        reset({});
      },
    });
  };

  // Process form data to handle nested fields and checkbox groups
  const processFormData = (data: Record<string, any>, form: FormStructure | null) => {
    if (!form) return data;

    try {
      const result: Record<string, any> = { ...data };

      const processFields = (fields: FormFieldType[]) => {
        fields.forEach(field => {
          if (field.type === 'group' && field.fields) {
            // Create an object for the group if it doesn't exist
            if (!result[field.id]) {
              result[field.id] = {};
            }

            // Process nested fields
            field.fields.forEach(nestedField => {
              if (data[nestedField.id] !== undefined) {
                result[field.id][nestedField.id] = data[nestedField.id];
                delete result[nestedField.id];
              }
            });
          }

          if (field.type === 'checkbox' && Array.isArray(field.options) && field.options.length > 0) {
            if (result[field.id] && !Array.isArray(result[field.id])) {
              result[field.id] = [result[field.id]];
            }
          }
        });
      };

      processFields(form.fields);
      return result;
    } catch (error) {
      console.error('Error processing form data:', error);
      return data;
    }
  };

  const fieldGroups = currentForm?.fields.filter(field => field.type === 'group') || [];
  const standaloneFields = currentForm?.fields.filter(field => field.type !== 'group') || [];

  const steps = standaloneFields.length > 0
    ? [{ id: 'general', label: 'General Information', type: 'group', fields: standaloneFields }, ...fieldGroups]
    : fieldGroups;

  // Handle next step
  const handleNext = async () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Handle form submission
  const handleFormSubmit = () => {
    handleSubmit(onSubmit)();
  };

  // Toggle field reordering
  const toggleReordering = () => {
    setIsReorderingEnabled(!isReorderingEnabled);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading form: {error instanceof Error ? error.message : 'Unknown error'}
      </Alert>
    );
  }

  if (!currentForm) {
    return (
      <Alert severity="info">
        No form found with ID {formId}. Please select a different form.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {currentForm.title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isReorderingEnabled}
              onChange={toggleReordering}
              color="primary"
            />
          }
          label="Enable field reordering"
        />
      </Box>
      
      {isReorderingEnabled && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          icon={<DragIndicatorIcon />}
        >
          Reordering mode is active. Drag and drop fields to reorder them. Fields with nested content cannot be reordered.
        </Alert>
      )}

      {steps.length > 1 && (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      <Divider sx={{ mb: 3 }} />

      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          {steps.map((step, index) => (
            <Box
              key={step.id}
              sx={{ display: activeStep === index ? 'block' : 'none' }}
            >
              <FormSection
                field={step}
                formData={formData}
                isReorderingEnabled={isReorderingEnabled}
              />
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="button"
                onClick={handleFormSubmit}
                disabled={isSubmitting || !isValid}
              >
                Submit
                {isSubmitting && <CircularProgress size={24} sx={{ ml: 1 }} />}
              </Button>
            ) : (
              <Button
                variant="contained"
                type="button"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
      </FormProvider>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Form submitted successfully!
        </Alert>
      </Snackbar>

      {submitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error submitting form: {submitError instanceof Error ? submitError.message : 'Unknown error'}
        </Alert>
      )}
    </Paper>
  );
} 