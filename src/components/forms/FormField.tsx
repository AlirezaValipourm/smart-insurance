'use client';

import { useState, useEffect } from 'react';
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
import { useFormContext } from 'react-hook-form';
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
  
  // Fetch dynamic options if needed
  useEffect(() => {
    const fetchOptions = async () => {
      if (field.dynamicOptions && field.dynamicOptions.dependsOn) {
        const dependentField = field.dynamicOptions.dependsOn;
        // Handle case where dependent field might be in a parent group
        // For example, state depends on country but might be in different groups
        let dependentValue = watch(dependentField);
        
        // If we can't find the value directly, try to find it in the parent form data
        if (dependentValue === undefined && formData) {
          dependentValue = formData[dependentField];
        }
        
        if (dependentValue) {
          setIsLoadingOptions(true);
          try {
            const options = await fetchFieldOptions(
              field.dynamicOptions.endpoint,
              dependentValue
            );
            
            // Format options consistently
            const formattedOptions = Array.isArray(options) 
              ? options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt)
              : options;
              
            setDynamicOptions(formattedOptions);
          } catch (error) {
            console.error(`Error fetching options for field ${field.id}:`, error);
          } finally {
            setIsLoadingOptions(false);
          }
        }
      }
    };
    
    fetchOptions();
  }, [field.dynamicOptions, watch, field.id, fetchFieldOptions, formData]);
  
  // Handle onChange manually for some components
  const handleChange = (value: any) => {
    setValue(field.id, value, { shouldValidate: true });
  };
  
  // Register field with react-hook-form
  const { onChange, onBlur, name, ref } = register(field.id);
  
  // Process options to ensure they're in the right format
  const processOptions = (options: any[] | undefined) => {
    if (!options) return [];
    return options.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt);
  };
  
  // Combine static and dynamic options
  const allOptions = [...processOptions(field.options), ...dynamicOptions];
  
  // Render field based on its type
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'password':
      // Add pattern validation if specified
      const registerOptions: any = {};
      
      if (field.validation?.pattern) {
        registerOptions.validate = (value: string) => {
          const pattern = new RegExp(field.validation!.pattern!);
          return pattern.test(value) || `Invalid format. Expected pattern: ${field.validation!.pattern}`;
        };
      }
      
      return (
        <TextField
          id={field.id}
          name={name}
          inputRef={ref}
          onChange={(e) => {
            onChange(e);
            if (field.validation?.pattern) {
              const pattern = new RegExp(field.validation.pattern);
              const isValid = pattern.test(e.target.value);
              if (!isValid) {
                // This will trigger validation
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
        />
      );
      
    case 'number':
      return (
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
        />
      );
      
    case 'select':
      return (
        <FormControl fullWidth error={!!error} required={field.required}>
          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.id}-label`}
            id={field.id}
            name={name}
            inputRef={ref}
            label={field.label}
            value={fieldValue || ''}
            onChange={(e) => {
              onChange(e);
              handleChange(e.target.value);
            }}
            onBlur={onBlur}
          >
            {isLoadingOptions ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              allOptions.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                
                return (
                  <MenuItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </MenuItem>
                );
              })
            )}
          </Select>
          {error && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );
      
    case 'checkbox':
      if (Array.isArray(field.options) && field.options.length > 0) {
        // Multiple checkboxes
        return (
          <FormControl required={field.required} error={!!error} component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <Box>
              {allOptions.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                
                // For multiple checkboxes, we need to track an array of values
                const isChecked = Array.isArray(fieldValue) 
                  ? fieldValue.includes(optionValue)
                  : false;
                
                return (
                  <FormControlLabel
                    key={optionValue}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => {
                          let newValue: string[] = [];
                          
                          if (Array.isArray(fieldValue)) {
                            newValue = [...fieldValue];
                          }
                          
                          if (e.target.checked) {
                            if (!newValue.includes(optionValue)) {
                              newValue.push(optionValue);
                            }
                          } else {
                            newValue = newValue.filter(v => v !== optionValue);
                          }
                          
                          handleChange(newValue);
                        }}
                      />
                    }
                    label={optionLabel}
                  />
                );
              })}
            </Box>
            {error && <Typography color="error" variant="caption">{errorMessage}</Typography>}
          </FormControl>
        );
      }
      
      // Single checkbox
      return (
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              inputRef={ref}
              checked={!!fieldValue}
              onChange={(e) => {
                onChange(e);
                handleChange(e.target.checked);
              }}
              onBlur={onBlur}
            />
          }
          label={field.label}
        />
      );
      
    case 'radio':
      return (
        <FormControl required={field.required} error={!!error}>
          <FormLabel>{field.label}</FormLabel>
          <RadioGroup
            name={name}
            value={fieldValue || ''}
            onChange={(e) => {
              onChange(e);
              handleChange(e.target.value);
            }}
          >
            {allOptions.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              
              return (
                <FormControlLabel
                  key={optionValue}
                  value={optionValue}
                  control={<Radio inputRef={ref} onBlur={onBlur} />}
                  label={optionLabel}
                />
              );
            })}
          </RadioGroup>
          {error && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );
      
    case 'date':
      return (
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
          helperText={errorMessage}
          required={field.required}
          InputLabelProps={{ shrink: true }}
        />
      );
      
    default:
      return (
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
        />
      );
  }
} 