'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Radio,
  RadioGroup,
  FormLabel,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import { FormField as FormFieldType } from '../../store/slices/formSlice';
import { useFormContext, useWatch } from 'react-hook-form';
import { useFormData } from '../../hooks/useFormData';

interface FormFieldProps {
  field: FormFieldType;
  value?: any;
  formData?: Record<string, any>;
}

/**
 * Form field component that renders a form field based on its type
 * @param field - The field to render
 * @returns The form field component
 */
export default function FormField({ field, formData }: FormFieldProps) {
  const [dynamicOptions, setDynamicOptions] = useState<any[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const { fetchFieldOptions } = useFormData();
  const { register, formState: { errors }, setValue, watch } = useFormContext();

  const fieldValue = watch(field.id);
  const error = errors[field.id];
  const errorMessage = error ? String(error.message) : '';

  const dependentValue = field.dynamicOptions?.dependsOn ? useWatch({ name: field.dynamicOptions.dependsOn }) : undefined;

  useEffect(() => {
    const fetchOptions = async () => {
      if (field.dynamicOptions && field.dynamicOptions.endpoint) {
        // Only fetch if we have a dependent value or the endpoint doesn't require one
        if (dependentValue || !field.dynamicOptions.dependsOn) {
          setIsLoadingOptions(true);
          setDynamicOptions([]); // Clear previous options while loading

          try {
            console.log(`Fetching options for ${field.id} from ${field.dynamicOptions.endpoint}`);
            const options = await fetchFieldOptions(
              field.dynamicOptions.endpoint,
              dependentValue || ''
            );
            // Format options consistently
            const formattedOptions = Array.isArray(options)
              ? options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt)
              : [];
            console.log(`Received ${formattedOptions.length} options for ${field.id}`);
            setDynamicOptions(formattedOptions);
          } catch (error) {
            console.error(`Error fetching options for field ${field.id}:`, error);
            setDynamicOptions([]); // Clear options on error
          } finally {
            setIsLoadingOptions(false);
          }
        }
      }
    };

    // Fetch options when the component mounts or when the dependent value changes
    fetchOptions();

    // Set up a timer to periodically refresh options if needed
    // This is useful for options that might change over time
    const refreshInterval = setInterval(() => {
      if (field.dynamicOptions?.refreshInterval) {
        fetchOptions();
      }
    }, field.dynamicOptions?.refreshInterval || 300000); // Default to 5 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [dependentValue, field.dynamicOptions, field.id, fetchFieldOptions]);

  // Handle onChange manually for some components
  const handleChange = useCallback((value: any) => {
    setValue(field.id, value, { shouldValidate: true });
  }, [field.id, setValue]);

  // Register field with react-hook-form
  const { onChange, onBlur, name, ref } = register(field.id);

  // Process options to ensure they're in the right format
  const processOptions = useCallback((options: any[] | undefined) => {
    if (!options) return [];
    return options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt);
  }, []);

  // Combine static and dynamic options
  const availableOptions = useMemo(() => {
    return [...processOptions(field.options), ...dynamicOptions];
  }, [processOptions, field.options, dynamicOptions]);

  // Render field based on its type
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'password': {
      // Set up validation for pattern-based fields (like zip code, phone number)
      const validationOptions: any = {};
      
      if (field.validation?.pattern) {
        validationOptions.validate = (value: string) => {
          const pattern = new RegExp(field.validation!.pattern!);
          return pattern.test(value) || `Invalid format. Please check your input.`;
        };
      }

      return (
        <Box sx={{ width: '100%' }}>
          <TextField
            id={field.id}
            name={name}
            inputRef={ref}
            onChange={(e) => {
              onChange(e);
              // Validate pattern as user types
              if (field.validation?.pattern) {
                const pattern = new RegExp(field.validation.pattern);
                const isValid = pattern.test(e.target.value);
                if (!isValid) {
                  setValue(field.id, e.target.value, { shouldValidate: true });
                }
              }
            }}
            onBlur={onBlur}
            label={field.label}
            type={field.type}
            fullWidth
            error={!!error}
            helperText={errorMessage}
            required={field.required}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            sx={{ width: '100%' }}
          />
        </Box>
      );
    }

    case 'number':
      return (
        <Box sx={{ width: '100%' }}>
          <TextField
            id={field.id}
            name={name}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
            label={field.label}
            type="number"
            fullWidth
            error={!!error}
            helperText={errorMessage}
            required={field.required}
            inputProps={{
              min: field.validation?.min,
              max: field.validation?.max
            }}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            sx={{ width: '100%' }}
          />
        </Box>
      );

    case 'select':
      return (
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth error={!!error} sx={{ width: '100%' }}>
            <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              id={field.id}
              name={name}
              inputRef={ref}
              value={fieldValue || ''}
              onChange={(e) => {
                // Call the original onChange from react-hook-form first
                onChange(e);
                
                // Only update if value actually changed
                if (e.target.value !== fieldValue) {
                  // Use a timeout to prevent UI freezing
                  setTimeout(() => {
                    setValue(field.id, e.target.value, { shouldValidate: true });
                  }, 0);
                }
              }}
              onBlur={onBlur}
              label={field.label}
              disabled={isLoadingOptions}
              required={field.required}
              sx={{ width: '100%' }}
            >
              {/* Show appropriate content based on loading state and available options */}
              {isLoadingOptions ? (
                <MenuItem value="" disabled>
                  Loading options...
                </MenuItem>
              ) : availableOptions.length === 0 ? (
                <MenuItem value="" disabled>
                  No options available
                </MenuItem>
              ) : [
                <MenuItem key="empty" value="">
                  <em>Select {field.label.toLowerCase()}</em>
                </MenuItem>,
                ...availableOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              ]}
            </Select>
            {error && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        </Box>
      );

    case 'checkbox':
      if (Array.isArray(field.options) && field.options.length > 0) {
        // Multiple checkboxes
        return (
          <Box sx={{ width: '100%' }}>
            <FormControl required={field.required} error={!!error} component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend">{field.label}</FormLabel>
              <Box sx={{ mt: 1, width: '100%' }}>
                {availableOptions.map((option) => {
                  const optionValue = typeof option === 'string' ? option : option.value;
                  const optionLabel = typeof option === 'string' ? option : option.label;
                  
                  // For multiple checkboxes, we need to track an array of values
                  const isSelected = Array.isArray(fieldValue) 
                    ? fieldValue.includes(optionValue)
                    : false;
                  
                  return (
                    <FormControlLabel
                      key={optionValue}
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            let selectedValues: string[] = [];
                            
                            if (Array.isArray(fieldValue)) {
                              selectedValues = [...fieldValue];
                            }
                            
                            if (e.target.checked) {
                              if (!selectedValues.includes(optionValue)) {
                                selectedValues.push(optionValue);
                              }
                            } else {
                              selectedValues = selectedValues.filter(v => v !== optionValue);
                            }
                            
                            setValue(field.id, selectedValues, { shouldValidate: true });
                          }}
                        />
                      }
                      label={optionLabel}
                      sx={{ display: 'block', mb: 1 }}
                    />
                  );
                })}
              </Box>
              {error && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errorMessage}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
      }
      
      // Single checkbox
      return (
        <Box sx={{ width: '100%' }}>
          <FormControlLabel
            control={
              <Checkbox
                name={name}
                inputRef={ref}
                checked={!!fieldValue}
                onChange={(e) => {
                  onChange(e);
                  setValue(field.id, e.target.checked, { shouldValidate: true });
                }}
                onBlur={onBlur}
              />
            }
            label={field.label}
            sx={{ mb: 2, width: '100%' }}
          />
        </Box>
      );
      
    case 'radio':
      return (
        <Box sx={{ width: '100%' }}>
          <FormControl required={field.required} error={!!error} sx={{ mb: 2, width: '100%' }}>
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              name={name}
              value={fieldValue || ''}
              onChange={(e) => {
                onChange(e);
                setValue(field.id, e.target.value, { shouldValidate: true });
              }}
              sx={{ mt: 1, width: '100%' }}
            >
              {availableOptions.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                
                return (
                  <FormControlLabel
                    key={optionValue}
                    value={optionValue}
                    control={<Radio inputRef={ref} onBlur={onBlur} />}
                    label={optionLabel}
                    sx={{ display: 'block', mb: 1 }}
                  />
                );
              })}
            </RadioGroup>
            {error && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        </Box>
      );
      
    case 'date':
      return (
        <Box sx={{ width: '100%' }}>
          <TextField
            id={field.id}
            name={name}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
            label={field.label}
            type="date"
            fullWidth
            error={!!error}
            helperText={errorMessage || 'YYYY-MM-DD'}
            required={field.required}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2, width: '100%' }}
          />
        </Box>
      );
      
    default:
      return (
        <Box sx={{ width: '100%' }}>
          <TextField
            id={field.id}
            name={name}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
            label={field.label}
            fullWidth
            error={!!error}
            helperText={errorMessage}
            required={field.required}
            sx={{ mb: 2, width: '100%' }}
          />
        </Box>
      );
  }
} 