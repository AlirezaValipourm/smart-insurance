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
  Snackbar
} from '@mui/material';
import { RootState } from '../../store';
import { resetForm } from '../../store/slices/formSlice';
import { useFormData } from '../../hooks/useFormData';
import { useFormValidation } from '../../hooks/useFormValidation';
import FormSection from './FormSection';

interface DynamicFormProps {
  insuranceType?: string;
}

/**
 * Dynamic form component that renders a form based on the form structure
 * @param insuranceType - Optional insurance type to filter forms
 * @returns The dynamic form component
 */
export default function DynamicForm({ insuranceType }: DynamicFormProps) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Get form data from Redux and React Query
  const { formStructure, formData, isDraft } = useSelector((state: RootState) => state.form);
  const { isLoading, error, submitForm, isSubmitting, submitError } = useFormData(insuranceType);
  
  // Get form validation methods from React Hook Form
  const { 
    handleSubmit, 
    errors, 
    isValid,
    formValues,
    reset
  } = useFormValidation();

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
    submitForm(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        setOpenSnackbar(true);
        dispatch(resetForm());
        reset({});
      },
    });
  };

  // Handle next step
  const handleNext = async () => {
    if (activeStep === (formStructure?.sections.length || 0) - 1) {
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

  if (!formStructure) {
    return (
      <Alert severity="info">
        No form structure available. Please select an insurance type.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {formStructure.title}
      </Typography>
      
      {isDraft && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have a draft in progress. Your changes are being saved automatically.
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {formStructure.sections.map((section) => (
          <Step key={section.id}>
            <StepLabel>{section.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <form>
        {formStructure.sections.map((section, index) => (
          <Box
            key={section.id}
            sx={{ display: activeStep === index ? 'block' : 'none' }}
          >
            <Typography variant="h6" gutterBottom>
              {section.title}
            </Typography>
            
            <FormSection 
              section={section} 
              formData={formValues} 
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
          
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isSubmitting || (activeStep === formStructure.sections.length - 1 && !isValid)}
          >
            {activeStep === formStructure.sections.length - 1 ? 'Submit' : 'Next'}
            {isSubmitting && <CircularProgress size={24} sx={{ ml: 1 }} />}
          </Button>
        </Box>
      </form>
      
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