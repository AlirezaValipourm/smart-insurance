'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { FormField as FormFieldType } from '../../store/slices/formSlice';
import { useFormContext } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import { FormField } from './FormField';
import { useDispatch } from 'react-redux';
import { reorderFields } from '../../store/slices/formSlice';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface FormSectionProps {
  field: FormFieldType;
  formData: Record<string, any>;
  isReorderingEnabled?: boolean;
}

/**
 * Insurance Form Section Component
 * 
 * This component renders a group of related form fields as a section.
 * It handles visibility conditions for fields and special dependencies between fields.
 * It also supports nested sections (groups within groups).
 * Now with drag-and-drop reordering capability using HTML5 drag and drop.
 * 
 * @param field - The field group configuration object
 * @param formData - The current form data
 * @param isReorderingEnabled - Whether field reordering is enabled
 * @returns A section containing multiple form fields
 */
export function FormSection({ field, formData, isReorderingEnabled = false }: FormSectionProps) {
  const { watch, getValues, formState: { errors } } = useFormContext();
  const dispatch = useDispatch();
  
  // State to track the current order of fields
  const [orderedFields, setOrderedFields] = useState<FormFieldType[]>(
    field.fields || []
  );
  
  // State to track the dragging field
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Update orderedFields when field.fields changes
  useEffect(() => {
    if (field.fields) {
      setOrderedFields(field.fields);
    }
  }, [field.fields]);
  
  // Function to check if a field has validation errors
  const hasFieldError = useCallback((fieldId: string) => {
    return !!errors[fieldId];
  }, [errors]);

  /**
   * Filter fields based on visibility conditions
   * For example, only show smoking frequency if user is a smoker
   */
  const visibleFields = useMemo(() => {
    return orderedFields.filter((nestedField) => {
      // If field has a visibility condition, check if it should be shown
      if (nestedField.visibility) {
        const { dependsOn, condition, value } = nestedField.visibility;
        const dependentFieldValue = watch(dependsOn);
        
        // Currently only supports 'equals' condition
        if (condition === 'equals') {
          return dependentFieldValue === value;
        }
        
        // Default to hidden if condition is not recognized
        return false;
      }
      
      // No visibility condition, always show the field
      return true;
    });
  }, [orderedFields, watch]);

  /**
   * Handle special dependencies between fields in different sections
   */
  const enrichedFormData = { ...formData };
  
  // Special case for home address section
  if (field.id === 'home_address') {
    // Get all current form values
    const allFormValues = getValues();
    
    // If country is selected elsewhere in the form, make it available to this section
    if (allFormValues.country) {
      enrichedFormData.country = allFormValues.country;
    }
  }

  /**
   * Handle drag start event
   */
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  /**
   * Handle drag over event
   */
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  /**
   * Handle drag end event
   */
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  /**
   * Handle drop event
   */
  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    
    // Don't do anything if the position didn't change
    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Create a copy of the fields array
    const newOrderedFields = Array.from(orderedFields);
    
    // Remove the dragged item from the array
    const [removed] = newOrderedFields.splice(draggedIndex, 1);
    
    // Insert the item at the new position
    newOrderedFields.splice(dropIndex, 0, removed);
    
    // Update the local state
    setOrderedFields(newOrderedFields);
    
    // Dispatch action to update the global state
    dispatch(reorderFields({
      sectionId: field.id,
      startIndex: draggedIndex,
      endIndex: dropIndex
    }));
    
    // Reset drag state
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, orderedFields, dispatch, field.id]);

  if (!isReorderingEnabled) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
        >
          {visibleFields.map((nestedField) => (
            <Box
              key={nestedField.id}
              sx={{ 
                p: 1,
                width: '100%'
              }}
            >
              {nestedField.type === 'group' ? (
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 500,
                      color: 'primary.main' 
                    }}
                  >
                    {nestedField.label}
                  </Typography>
                  <FormSection 
                    field={nestedField} 
                    formData={enrichedFormData}
                    isReorderingEnabled={isReorderingEnabled}
                  />
                </Box>
              ) : (
                <FormField 
                  field={nestedField} 
                  formData={enrichedFormData} 
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          width: '100%'
        }}
      >
        {visibleFields.map((nestedField, index) => {
          const isDraggable = nestedField.type !== 'group' && !hasFieldError(nestedField.id);
          const isDragging = index === draggedIndex;
          const isDragOver = index === dragOverIndex;
          
          return (
            <Box
              key={nestedField.id}
              draggable={isDraggable}
              onDragStart={isDraggable ? () => handleDragStart(index) : undefined}
              onDragOver={isDraggable ? (e) => handleDragOver(e, index) : undefined}
              onDragEnd={isDraggable ? handleDragEnd : undefined}
              onDrop={isDraggable ? (e) => handleDrop(e, index) : undefined}
              sx={{
                position: 'relative',
                p: 2,
                borderRadius: 1,
                border: isDragging 
                  ? '2px dashed' 
                  : isDragOver
                    ? '2px solid'
                    : hasFieldError(nestedField.id)
                      ? '1px solid'
                      : '1px solid transparent',
                borderColor: hasFieldError(nestedField.id) 
                  ? 'error.main' 
                  : isDragOver
                    ? 'primary.main'
                    : 'divider',
                bgcolor: isDragging 
                  ? 'action.selected' 
                  : isDragOver
                    ? 'action.hover'
                    : hasFieldError(nestedField.id)
                      ? 'error.light'
                      : 'transparent',
                opacity: hasFieldError(nestedField.id) ? 0.7 : 1,
                width: '100%',
                cursor: isDraggable ? 'grab' : 'default',
                '&:hover': {
                  bgcolor: !hasFieldError(nestedField.id) 
                    ? 'action.hover' 
                    : 'error.light',
                  '& .drag-handle': {
                    opacity: !hasFieldError(nestedField.id) ? 1 : 0,
                  }
                }
              }}
            >
              {isDraggable ? (
                <Box
                  className="drag-handle"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 10,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    padding: '4px'
                  }}
                >
                  <DragIndicatorIcon fontSize="small" />
                </Box>
              ) : (
                <Tooltip 
                  title={
                    nestedField.type === 'group' 
                      ? "Section fields cannot be reordered" 
                      : "Fields with validation errors cannot be reordered"
                  }
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      color: nestedField.type === 'group' ? 'info.main' : 'error.main',
                      backgroundColor: 'background.paper',
                      borderRadius: '50%',
                      padding: '4px'
                    }}
                  >
                    {nestedField.type === 'group' 
                      ? <InfoOutlinedIcon fontSize="small" />
                      : <ErrorOutlineIcon fontSize="small" />
                    }
                  </Box>
                </Tooltip>
              )}

              {nestedField.type === 'group' ? (
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 500,
                      color: 'primary.main' 
                    }}
                  >
                    {nestedField.label}
                  </Typography>
                  <FormSection 
                    field={nestedField} 
                    formData={enrichedFormData}
                    isReorderingEnabled={isReorderingEnabled}
                  />
                </Box>
              ) : (
                <FormField 
                  field={nestedField} 
                  formData={enrichedFormData} 
                />
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  );
} 