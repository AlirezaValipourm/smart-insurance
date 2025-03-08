'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { FormField, updateFormField, saveDraft } from '../store/slices/formSlice';
import { useFormData } from './useFormData';
import FormSection from '../components/forms/FormSection';

/**
 * Custom hook for form validation using React Hook Form and Zod
 * @returns Object with form validation methods and state
 */
export const useFormValidation = () => {
  const dispatch = useDispatch();
  
  // Get form structure and data from Redux
  const { currentForm, formData } = useSelector((state: RootState) => state.form);
  const { saveDraft: saveFormDraft } = useFormData();

  // Build Zod schema dynamically based on form structure
  const buildZodSchema = () => {
    if (!currentForm) return z.object({});

    const schemaFields: Record<string, any> = {};

    // Define the processField function first
    function processField(field: FormField) {
      // Skip fields with visibility conditions not met
      if (field.visibility) {
        const { dependsOn, condition, value } = field.visibility;
        if (condition === 'equals' && formData[dependsOn] !== value) {
          return;
        }
      }
      
      // Build validation schema based on field type and validation rules
      let fieldSchema: any = z.any();

      if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
        fieldSchema = z.string();
        
        // Add email validation
        if (field.type === 'email') {
          fieldSchema = fieldSchema.email('Invalid email address');
        }
        
        // Add phone validation
        if (field.type === 'tel') {
          fieldSchema = fieldSchema.regex(/^\d{10}$/, 'Phone number must be 10 digits');
        }
        
        // Add pattern validation if specified
        if (field.validation?.pattern) {
          fieldSchema = fieldSchema.regex(
            new RegExp(field.validation.pattern),
            `Invalid format. Expected pattern: ${field.validation.pattern}`
          );
        }
      } else if (field.type === 'number') {
        fieldSchema = z.coerce.number();
        
        // Add min/max validation if specified
        if (field.validation?.min !== undefined) {
          fieldSchema = fieldSchema.min(field.validation.min, `Value must be at least ${field.validation.min}`);
        }
        
        if (field.validation?.max !== undefined) {
          fieldSchema = fieldSchema.max(field.validation.max, `Value must be at most ${field.validation.max}`);
        }
      } else if (field.type === 'boolean') {
        fieldSchema = z.boolean();
      } else if (field.type === 'date') {
        fieldSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');
      } else if (field.type === 'select') {
        fieldSchema = z.string();
      } else if (field.type === 'radio') {
        fieldSchema = z.string();
      } else if (field.type === 'checkbox' && Array.isArray(field.options) && field.options.length > 0) {
        fieldSchema = z.array(z.string()).optional();
        if (field.required) {
          fieldSchema = z.array(z.string()).min(1, 'At least one option must be selected');
        }
      }
      
      // Add the field schema to schemaFields
      schemaFields[field.id] = field.required ? fieldSchema : fieldSchema.optional();
    }

    // Process all fields in the form
    const processFields = (fields: FormField[]) => {
      fields.forEach(field => {
        if (field.type === 'group' && field.fields) {
          // Process nested fields in groups
          field.fields.forEach(nestedField => {
            processField(nestedField);
          });
        } else {
          processField(field);
        }
      });
    };

    processFields(currentForm.fields);
    return z.object(schemaFields);
  };

  const zodSchema = buildZodSchema();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: formData,
    mode: 'onChange',
  });

  // Watch for form changes to update Redux store
  const formValues = watch();
  
  useEffect(() => {
    if (isDirty && Object.keys(formValues).length > 0) {
      // Update form data in Redux store
      Object.entries(formValues).forEach(([field, value]) => {
        if (formData[field] !== value) {
          dispatch(updateFormField({ field, value }));
        }
      });
      
      // Auto-save draft
      dispatch(saveDraft());
      
      // Save draft to localStorage via API
      if (currentForm?.formId) {
        saveFormDraft(formValues);
      }
    }
  }, [formValues, isDirty, dispatch, formData, currentForm, saveFormDraft]);

  // Reset form when form structure changes
  useEffect(() => {
    if (currentForm) {
      reset(formData);
    }
  }, [currentForm, reset, formData]);

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    reset,
    setValue,
    watch,
    trigger,
    formValues,
  };
};

export default useFormValidation; 