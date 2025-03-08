'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import { RootState } from '../../store';
import { resetForm, FormStructure, FormField as FormFieldType } from '../../store/slices/formSlice';
import { useFormData } from '../../hooks/useFormData';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormSection from './FormSection';

interface DynamicFormProps {
  formId: string;
}

/**
 * Dynamic form component that renders a form based on the form structure
 * @param formId - The ID of the form to render
 * @returns The dynamic form component
 */
export default function DynamicForm({ formId }: DynamicFormProps) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Get form data from Redux and React Query
  const { formData, isDraft } = useSelector((state: RootState) => state.form);
  const { currentForm, isLoading, error, submitForm, isSubmitting, submitError } = useFormData(formId);
  
  // Create a simple form schema
  const formSchema = z.object({}).catchall(z.any());
  
  // Initialize React Hook Form
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: 'onChange',
  });
  
  const { handleSubmit, reset, formState: { isValid } } = methods;

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      if (!isSubmitted) {
        // Only save draft if not submitted
        // Draft saving is handled in useFormValidation
      }
    };
  }, [isSubmitted]);

  // Handle form submission
  const onSubmit = (data: Record<string, any>) => {
    // Process form data to handle nested fields and checkbox groups
    const processedData = processFormData(data, currentForm || null);
    
    // Add form ID to form data
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
    
    const result: Record<string, any> = { ...data };
    
    // Process each field
    const processFields = (fields: FormFieldType[]) => {
      fields.forEach(field => {
        // Handle group fields
        if (field.type === 'group' && field.fields) {
          // Create an object for the group if it doesn't exist
          if (!result[field.id]) {
            result[field.id] = {};
          }
          
          // Process nested fields
          field.fields.forEach(nestedField => {
            // If the nested field has a value in the form data, add it to the group
            if (data[nestedField.id] !== undefined) {
              result[field.id][nestedField.id] = data[nestedField.id];
              
              // Remove the flat field from the result to avoid duplication
              delete result[nestedField.id];
            }
          });
        }
      });
    };
    
    processFields(form.fields);
    return result;
  };

  // Group fields into steps
  const fieldGroups = currentForm?.fields.filter(field => field.type === 'group') || [];
  const standaloneFields = currentForm?.fields.filter(field => field.type !== 'group') || [];
  
  // Combine standalone fields into a single group if there are any
  const steps = standaloneFields.length > 0 
    ? [{ id: 'general', label: 'General Information', type: 'group', fields: standaloneFields }, ...fieldGroups]
    : fieldGroups;

  // Handle next step
  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Last step, submit form
      handleSubmit(onSubmit)();
    } else {
      // Go to next step
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      
      {isDraft && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have a draft in progress. Your changes are being saved automatically.
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {steps.map((step, index) => (
            <Box
              key={step.id}
              sx={{ display: activeStep === index ? 'block' : 'none' }}
            >
              <FormSection 
                field={step} 
                formData={formData} 
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
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                Submit
                {isSubmitting && <CircularProgress size={24} sx={{ ml: 1 }} />}
              </Button>
            ) : (
              <Button
                variant="contained"
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