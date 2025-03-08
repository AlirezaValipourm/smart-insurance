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
    try {
      // For testing purposes, return mock data based on the dependent value
      // In a real application, this would make an API call to the endpoint
      
      // Mock implementation for states based on country
      if (endpoint === '/api/getStates') {
        console.log(`Fetching states for country: ${dependentValue}`);
        switch (dependentValue) {
          case 'USA':
            return [
              'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
              'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia'
            ];
          case 'Canada':
            return [
              'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
              'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
              'Prince Edward Island', 'Quebec', 'Saskatchewan'
            ];
          case 'Germany':
            return [
              'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 
              'Bremen', 'Hamburg', 'Hesse', 'Lower Saxony', 
              'Mecklenburg-Vorpommern', 'North Rhine-Westphalia'
            ];
          case 'France':
            return [
              'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 
              'Centre-Val de Loire', 'Corsica', 'Grand Est', 
              'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine'
            ];
          default:
            console.log(`No states found for country: ${dependentValue}`);
            return [];
        }
      }
      
      // If not a known endpoint, try to fetch from the API
      // Remove the leading slash if present
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
      
      const response = await apiClient.get(cleanEndpoint, {
        params: { dependentValue },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching options from ${endpoint}:`, error);
      throw error;
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