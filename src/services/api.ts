import axios from 'axios';
import { FormStructure } from '../store/slices/formSlice';
import { SubmissionItem } from '../store/slices/submissionsSlice';

/**
 * Base URL for API requests
 */
const BASE_URL = 'https://assignment.devotel.io';

/**
 * Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API service for insurance forms
 */
export const insuranceApi = {
  /**
   * Fetch form structure from API
   * @returns Promise with form structure
   */
  getFormStructure: async (): Promise<FormStructure> => {
    try {
      const response = await apiClient.get('/api/insurance/forms');
      return response.data;
    } catch (error) {
      console.error('Error fetching form structure:', error);
      throw error;
    }
  },

  /**
   * Submit form data to API
   * @param formData - The form data to submit
   * @returns Promise with submission response
   */
  submitForm: async (formData: Record<string, any>): Promise<any> => {
    try {
      const response = await apiClient.post('/api/insurance/forms/submit', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  /**
   * Fetch submissions from API
   * @param params - Optional query parameters for pagination, sorting, etc.
   * @returns Promise with submissions data
   */
  getSubmissions: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    search?: string;
  }): Promise<{
    columns: string[];
    data: SubmissionItem[];
    totalItems: number;
  }> => {
    try {
      const response = await apiClient.get('/api/insurance/forms/submissions', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  /**
   * Fetch options for a dynamic field (e.g., states based on country)
   * @param fieldId - The ID of the field
   * @param dependentValue - The value of the dependent field
   * @returns Promise with options data
   */
  getFieldOptions: async (
    fieldId: string,
    dependentValue: string
  ): Promise<{ label: string; value: string }[]> => {
    try {
      const response = await apiClient.get(`/api/insurance/fields/${fieldId}/options`, {
        params: { dependentValue },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching options for field ${fieldId}:`, error);
      throw error;
    }
  },
};

export default apiClient; 