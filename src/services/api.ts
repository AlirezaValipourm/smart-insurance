import axios from 'axios';
import { FormStructure } from '../store/slices/formSlice';
import { SubmissionItem } from '../store/slices/submissionsSlice';

/**
 * Base URL for API requests
 * Using a relative URL to our Next.js API proxy to avoid CORS issues
 */
const BASE_URL = '/api/external';
// const BASE_URL = 'https://assignment.devotel.io/';

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
 * Implements the endpoints specified in the documentation:
 * - GET /api/insurance/forms: Fetches the dynamic form structure
 * - POST /api/insurance/forms/submit: Submits the completed form
 * - GET /api/insurance/forms/submissions: Retrieves the list of submitted applications
 * - GET /api/insurance/fields/{fieldId}/options: Fetches options for dynamic fields
 */
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
    console.log("getfieldoptions", endpoint, dependentValue);
    try {
      // Prevent empty or undefined dependent values from causing issues
      if (!dependentValue) {
        console.log('No dependent value provided for dynamic options');
        return [];
      }

      // Special handling for getStates endpoint
      if (endpoint === '/api/getStates') {
        // Use our internal API endpoint
        console.log(`Fetching states for country: ${dependentValue}`);
        const response = await axios.get('/api/external/getStates', {
          params: { country: dependentValue }
        });
        console.log("response", response);
        if (response.data.states && Array.isArray(response.data.states)) {
          console.log(`Successfully fetched ${response.data.states.length} states for ${dependentValue}`);
          return response.data.states;
        }
        return [];
      }

      // For other endpoints, use the external API proxy
      // Clean the endpoint to ensure proper formatting
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

      // Try to fetch from the actual API
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
        // Continue to mock data if API call fails
      }

      // Fallback to mock data for testing purposes
      console.warn(`No data available for endpoint: ${endpoint}`);
      return [];
    } catch (error) {
      console.error(`Error fetching options from ${endpoint}:`, error);
      return [];
    }
  },

  /**
   * Save draft form data
   * This is a client-side implementation using localStorage
   * @param formData - The form data to save as draft
   * @param formId - The ID of the form
   */
  saveDraft: (formData: Record<string, any>, formId: string): void => {
    try {
      localStorage.setItem(`draft_${formId}`, JSON.stringify(formData));
      localStorage.setItem('draft_timestamp', new Date().toISOString());
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  },

  /**
   * Load draft form data
   * This is a client-side implementation using localStorage
   * @param formId - The ID of the form
   * @returns The draft form data or null if no draft exists
   */
  loadDraft: (formId: string): Record<string, any> | null => {
    try {
      const draft = localStorage.getItem(`draft_${formId}`);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  },

  /**
   * Clear draft form data
   * This is a client-side implementation using localStorage
   * @param formId - The ID of the form
   */
  clearDraft: (formId: string): void => {
    try {
      localStorage.removeItem(`draft_${formId}`);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }
};

export default apiClient; 