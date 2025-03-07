'use client';

import { Grid, Box } from '@mui/material';
import { FormSection as FormSectionType } from '../../store/slices/formSlice';
import FormField from './FormField';

interface FormSectionProps {
  section: FormSectionType;
  formData: Record<string, any>;
}

/**
 * Form section component that renders a section of form fields
 * @param section - The section to render
 * @param formData - The current form data
 * @returns The form section component
 */
export default function FormSection({ section, formData }: FormSectionProps) {
  // Filter fields based on dependencies
  const visibleFields = section.fields.filter((field) => {
    // If field has a dependency, check if it should be shown
    if (field.dependsOn) {
      const { field: dependentField, value: dependentValue } = field.dependsOn;
      return formData[dependentField] === dependentValue;
    }
    
    // No dependency, always show
    return true;
  });

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {visibleFields.map((field) => (
          <Grid 
            item 
            xs={12} 
            md={field.type === 'textarea' ? 12 : 6} 
            key={field.id}
          >
            <FormField 
              field={field} 
              value={formData[field.id]} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 