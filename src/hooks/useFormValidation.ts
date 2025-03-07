'use client';

import { useState } from 'react';

/**
 * Custom hook for form validation (mock implementation)
 * @returns Object with form validation methods and state
 */
export const useFormValidation = () => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // Mock register function
  const register = (name: string) => ({
    name,
    onChange: (e: any) => {
      setFormValues((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    },
  });
  
  // Mock handleSubmit function
  const handleSubmit = (onSubmit: (data: Record<string, any>) => void) => () => {
    onSubmit(formValues);
  };
  
  // Mock reset function
  const reset = (values: Record<string, any> = {}) => {
    setFormValues(values);
  };
  
  return {
    register,
    handleSubmit,
    errors: {},
    isValid: true,
    isDirty: false,
    reset,
    setValue: (name: string, value: any) => {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    watch: (name?: string) => (name ? formValues[name] : formValues),
    trigger: () => Promise.resolve(true),
    formValues,
  };
};

export default useFormValidation; 