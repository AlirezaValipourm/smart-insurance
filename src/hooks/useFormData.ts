'use client';

import { useState } from 'react';

/**
 * Custom hook for fetching and managing form data (mock implementation)
 * @param insuranceType - Optional insurance type to filter forms
 * @returns Object with form data and related functions
 */
export const useFormData = (insuranceType?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock submit function
  const submitForm = (data: Record<string, any>, options?: { onSuccess?: () => void }) => {
    console.log('Submitting form data:', data);
    
    // Simulate successful submission
    setTimeout(() => {
      if (options?.onSuccess) {
        options.onSuccess();
      }
    }, 1000);
  };
  
  // Mock fetch field options function
  const fetchFieldOptions = async (fieldId: string, dependentValue: string) => {
    console.log(`Fetching options for field ${fieldId} with dependent value ${dependentValue}`);
    
    // Return mock options
    return [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];
  };
  
  return {
    formStructure: null,
    isLoading,
    error,
    submitForm,
    isSubmitting: false,
    submitError: null,
    fetchFieldOptions,
  };
};

export default useFormData; 