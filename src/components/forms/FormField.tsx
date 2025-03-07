'use client';

import { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { FormField as FormFieldType } from '../../store/slices/formSlice';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
}

/**
 * Form field component that renders a form field based on its type
 * @param field - The field to render
 * @param value - The current value of the field
 * @returns The form field component
 */
export default function FormField({ field, value }: FormFieldProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Common props for all fields
  const commonProps = {
    id: field.id,
    name: field.id,
    label: field.label,
    fullWidth: true,
    required: field.required,
    value: value || '',
    onChange: (e: any) => console.log('Field changed:', e.target.value),
  };
  
  // Render field based on type
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'password':
      return (
        <TextField
          {...commonProps}
          type={field.type}
        />
      );
      
    case 'number':
      return (
        <TextField
          {...commonProps}
          type="number"
          inputProps={{ min: 0 }}
        />
      );
      
    case 'textarea':
      return (
        <TextField
          {...commonProps}
          multiline
          rows={4}
        />
      );
      
    case 'select':
      return (
        <FormControl fullWidth>
          <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.id}-label`}
            id={field.id}
            label={field.label}
            value={value || ''}
            onChange={(e) => console.log('Select changed:', e.target.value)}
          >
            {isLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              (field.options || []).map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      );
      
    case 'checkbox':
      return (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => console.log('Checkbox changed:', e.target.checked)}
              />
            }
            label={field.label}
          />
        </FormControl>
      );
      
    case 'switch':
      return (
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => console.log('Switch changed:', e.target.checked)}
              />
            }
            label={field.label}
          />
        </FormControl>
      );
      
    case 'radio':
      return (
        <FormControl>
          <FormLabel>{field.label}</FormLabel>
          <RadioGroup
            value={value || ''}
            onChange={(e) => console.log('Radio changed:', e.target.value)}
          >
            {(field.options || []).map((option: any) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
      
    case 'date':
      return (
        <TextField
          {...commonProps}
          type="date"
          InputLabelProps={{ shrink: true }}
        />
      );
      
    default:
      return (
        <TextField
          {...commonProps}
        />
      );
  }
} 