import axios from 'axios';
import { FormStructure } from '../store/slices/formSlice';
import { SubmissionItem } from '../store/slices/submissionsSlice';

/**
 * Base URL for API requests
 * Using a relative URL to our Next.js API proxy to avoid CORS issues
 */
const BASE_URL = '/api/external';

/**
 * Axios instance with base configuration
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const insuranceApi = {
  /**
   * Fetch form structure from API
   * Endpoint: GET /api/insurance/forms
   * @returns Promise with form structure
   */
  getForms: async (): Promise<FormStructure[]> => {
    try {
      const response = await apiClient.get('/insurance/forms');
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  },

  /**
   * Get a specific form by ID
   * @param formId - The ID of the form to get
   * @returns Promise with form structure
   */
  getFormById: async (formId: string): Promise<FormStructure | null> => {
    try {
      const response = await apiClient.get('/insurance/forms');
      const forms = response.data as FormStructure[];
      return forms.find(form => form.formId === formId) || null;
    } catch (error) {
      console.error(`Error fetching form with ID ${formId}:`, error);
      throw error;
    }
  },

  /**
   * Submit form data to API
   * Endpoint: POST /api/insurance/forms/submit
   * @param formData - The form data to submit
   * @param formId - The ID of the form being submitted
   * @returns Promise with submission response
   */
  submitForm: async (formData: Record<string, any>, formId: string): Promise<any> => {
    try {
      const response = await apiClient.post('/insurance/forms/submit', {
        formId,
        data: formData,
        submittedAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  /**
   * Fetch submissions from API
   * Endpoint: GET /api/insurance/forms/submissions
   * Note: This API doesn't support query parameters, all filtering/sorting/pagination
   * will be handled client-side
   * @returns Promise with submissions data
   */
  getSubmissions: async (): Promise<{
    columns: string[];
    data: SubmissionItem[];
    totalItems: number;
  }> => {
    try {
      const response = await apiClient.get('/insurance/forms/submissions');
      return {
        columns: response.data.columns || [],
        data: response.data.data || [],
        totalItems: response.data.data?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  /**
   * Fetch options for a dynamic field (e.g., states based on country)
   * @param endpoint - The endpoint to fetch options from
   * @param dependentValue - The value of the dependent field
   * @returns Promise with options data
   */
  getFieldOptions: async (
    endpoint: string,
    dependentValue: string
  ): Promise<string[] | { label: string; value: string }[]> => {
    try {
      // Prevent empty or undefined dependent values from causing issues
      if (!dependentValue) {
        console.log('No dependent value provided for dynamic options');
        return [];
      }

      if (endpoint === '/api/getStates') {
        console.log(`Fetching states for country: ${dependentValue}`);
        const response = await axios.get('/api/external/getStates', {
          params: { country: dependentValue }
        });
        if (response.data.states && Array.isArray(response.data.states)) {
          console.log(`Successfully fetched ${response.data.states.length} states for ${dependentValue}`);
          return response.data.states;
        }
        return [];
      }

      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

      try {
        console.log(`Fetching options from ${cleanEndpoint} with value: ${dependentValue}`);
        const response = await apiClient.get(cleanEndpoint, {
          params: { dependentValue },
        });

        if (response.data && Array.isArray(response.data)) {
          console.log(`Successfully fetched ${response.data.length} options from API`);
          return response.data;
        }
      } catch (apiError) {
        console.warn(`API call failed, falling back to mock data: ${apiError}`);
      }

      console.warn(`No data available for endpoint: ${endpoint}`);
      return [];
    } catch (error) {
      console.error(`Error fetching options from ${endpoint}:`, error);
      return [];
    }
  },
}; 