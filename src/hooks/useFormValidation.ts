'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { RootState } from '../store';
import { FormField, updateFormField } from '../store/slices/formSlice';

/**
 * Custom hook for form validation using React Hook Form and Zod
 * @returns Object with form validation methods and state
 */
export const useFormValidation = () => {
  const dispatch = useDispatch();
  
  const { currentForm, formData } = useSelector((state: RootState) => state.form);

  // Build Zod schema dynamically based on form structure
  const buildZodSchema = () => {
    if (!currentForm) return z.object({});

    const schemaFields: Record<string, any> = {};

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
        
        if (field.type === 'email') {
          fieldSchema = fieldSchema.email('Invalid email address');
        }
        
        if (field.type === 'tel') {
          fieldSchema = fieldSchema.regex(/^\d{10}$/, 'Phone number must be 10 digits');
        }
        
        if (field.validation?.pattern) {
          fieldSchema = fieldSchema.regex(
            new RegExp(field.validation.pattern),
            `Invalid format. Expected pattern: ${field.validation.pattern}`
          );
        }
      } else if (field.type === 'number') {
        fieldSchema = z.coerce.number();
        
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
      
      schemaFields[field.id] = field.required ? fieldSchema : fieldSchema.optional();
    }

    const processFields = (fields: FormField[]) => {
      fields.forEach(field => {
        if (field.type === 'group' && field.fields) {
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

  const formValues = watch();
  
  useEffect(() => {
    if (isDirty && Object.keys(formValues).length > 0) {
      Object.entries(formValues).forEach(([field, value]) => {
        if (formData[field] !== value) {
          dispatch(updateFormField({ field, value }));
        }
      });
    }
  }, [formValues, isDirty, dispatch, formData]);

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
    zodSchema,
  };
}; 