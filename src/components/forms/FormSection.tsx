'use client';

import { Box } from '@mui/material';
import { FormField as FormFieldType } from '../../store/slices/formSlice';
import { useFormContext } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import FormField from './FormField';

interface FormSectionProps {
  field: FormFieldType;
  formData: Record<string, any>;
}

/**
 * Form section component that renders a section of form fields
 * @param field - The field group to render
 * @param formData - The current form data
 * @returns The form section component
 */
export default function FormSection({ field, formData }: FormSectionProps) {
  const { watch, getValues } = useFormContext();
  
  // Filter fields based on visibility conditions
  const visibleFields = field.fields?.filter((nestedField) => {
    // If field has a visibility condition, check if it should be shown
    if (nestedField.visibility) {
      const { dependsOn, condition, value } = nestedField.visibility;
      const currentValue = watch(dependsOn);
      
      if (condition === 'equals') {
        return currentValue === value;
      }
      
      return false; // Default to hidden if condition is not recognized
    }
    
    // No visibility condition, always show
    return true;
  }) || [];

  // Special handling for home_address.state which depends on country
  // but country might be in a different group
  const enhancedFormData = { ...formData };
  if (field.id === 'home_address') {
    // Try to find country value from the form values
    const allValues = getValues();
    if (allValues.country) {
      enhancedFormData.country = allValues.country;
    }
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        display="grid" 
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
        gap={3}
      >
        {visibleFields.map((nestedField) => (
          <Box
            key={nestedField.id}
            gridColumn={nestedField.type === 'group' ? { xs: '1', md: '1 / span 2' } : 'auto'}
          >
            {nestedField.type === 'group' ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>{nestedField.label}</Typography>
                <FormSection field={nestedField} formData={enhancedFormData} />
              </Box>
            ) : (
              <FormField field={nestedField} formData={enhancedFormData} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
} 