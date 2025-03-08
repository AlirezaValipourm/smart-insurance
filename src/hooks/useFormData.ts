'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { insuranceApi } from '../services/api';
import { 
  setForms, 
  setCurrentForm,
  setFormData,
  setLoading, 
  setError,
  saveDraft as saveDraftAction,
  clearDraft as clearDraftAction
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

  // Load draft data when component mounts
  useEffect(() => {
    if (formId) {
      const draftData = insuranceApi.loadDraft(formId);
      if (draftData) {
        dispatch(setFormData(draftData));
        dispatch(saveDraftAction());
      }
    }
  }, [formId, dispatch]);

  // Mutation for submitting form data
  const submitFormMutation = useMutation({
    mutationFn: (data: Record<string, any>) => {
      if (!formId) {
        throw new Error('Form ID is required to submit a form');
      }
      return insuranceApi.submitForm(data, formId);
    },
    onSuccess: () => {
      // Clear draft after successful submission
      if (formId) {
        insuranceApi.clearDraft(formId);
        dispatch(clearDraftAction());
      }
      
      // Invalidate and refetch submissions query to update the list
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  // Function to save draft
  const saveDraft = (formData: Record<string, any>) => {
    if (formId) {
      insuranceApi.saveDraft(formData, formId);
      dispatch(saveDraftAction());
    }
  };

  // Function to fetch field options dynamically
  const fetchFieldOptions = async (endpoint: string, dependentValue: string) => {
    try {
      return await insuranceApi.getFieldOptions(endpoint, dependentValue);
    } catch (error) {
      console.error(`Error fetching options from ${endpoint}:`, error);
      throw error;
    }
  };

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
    saveDraft,
  };
};

export default useFormData; 