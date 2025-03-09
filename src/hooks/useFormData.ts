'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { insuranceApi } from '../services/api';
import { 
  setForms, 
  setCurrentForm,
  setLoading, 
  setError,
  resetForm
} from '../store/slices/formSlice';

/**
 * Custom hook for fetching and managing form data
 * @param formId - Optional form ID to filter forms
 * @returns Object with form data and related functions
 */
export const useFormData = (formId?: string) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Query for fetching all forms
  const {
    data: forms,
    isLoading: isLoadingForms,
    error: formsError,
    refetch: refetchForms,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const data = await insuranceApi.getForms();
        dispatch(setForms(data));
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch forms';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: true, // Always fetch forms
  });

  // Query for fetching a specific form
  const {
    data: currentForm,
    isLoading: isLoadingForm,
    error: formError,
  } = useQuery({
    queryKey: ['form', formId],
    queryFn: async () => {
      if (!formId) return null;
      
      dispatch(setLoading(true));
      try {
        const data = await insuranceApi.getFormById(formId);
        if (data) {
          dispatch(setCurrentForm(data));
        }
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to fetch form with ID ${formId}`;
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: !!formId, // Only fetch if formId is provided
  });

  // Mutation for submitting form data
  const submitFormMutation = useMutation({
    mutationFn: (data: Record<string, any>) => {
      if (!formId) {
        throw new Error('Form ID is required to submit a form');
      }
      return insuranceApi.submitForm(data, formId);
    },
    onSuccess: () => {
      // Reset form after successful submission
      dispatch(resetForm());
      
      // Invalidate and refetch submissions query to update the list
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  // Function to fetch field options dynamically
  const fetchFieldOptions = useCallback(async (endpoint: string, dependentValue: string) => {
    if (!endpoint || !dependentValue) {
      console.warn('Missing endpoint or dependent value for fetchFieldOptions');
      return [];
    }
    
    try {
      const response = await insuranceApi.getFieldOptions(endpoint, dependentValue);
      return response;
    } catch (error) {
      console.error(`Error fetching options from ${endpoint}:`, error);
      // Return empty array instead of throwing to prevent UI issues
      return [];
    }
  }, []);

  return {
    forms,
    currentForm,
    isLoading: isLoadingForms || isLoadingForm,
    error: formsError || formError,
    refetchForms,
    submitForm: submitFormMutation.mutate,
    isSubmitting: submitFormMutation.isPending,
    submitError: submitFormMutation.error,
    fetchFieldOptions,
  };
}; 