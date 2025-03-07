'use client';

import { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DynamicForm from '../components/forms/DynamicForm';
import SubmissionsList from '../components/submissions/SubmissionsList';
import { useDispatch } from 'react-redux';
import { setCurrentInsuranceType } from '../store/slices/formSlice';

/**
 * Main page component
 * @returns The main page component
 */
export default function Home() {
  const [tabIndex, setTabIndex] = useState(0);
  const [insuranceType, setInsuranceType] = useState<string | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  
  // Handle insurance type selection
  const handleInsuranceTypeSelect = (type: string) => {
    setInsuranceType(type);
    dispatch(setCurrentInsuranceType(type));
  };
  
  // Insurance types
  const insuranceTypes = [
    { id: 'health', label: 'Health Insurance' },
    { id: 'car', label: 'Car Insurance' },
    { id: 'home', label: 'Home Insurance' },
    { id: 'life', label: 'Life Insurance' },
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Smart Insurance Portal
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange} 
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : undefined}
        >
          <Tab label="Apply for Insurance" />
          <Tab label="My Applications" />
        </Tabs>
      </Box>
      
      {tabIndex === 0 && (
        <Box>
          {!insuranceType ? (
            <Box>
              <Typography variant="h5" gutterBottom>
                Select Insurance Type
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                  gap: 2,
                  mt: 3
                }}
              >
                {insuranceTypes.map((type) => (
                  <Paper
                    key={type.id}
                    elevation={3}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleInsuranceTypeSelect(type.id)}
                  >
                    <Typography variant="h6">{type.label}</Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  {insuranceTypes.find(type => type.id === insuranceType)?.label}
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => setInsuranceType(null)}
                >
                  Change Type
                </Button>
              </Box>
              <DynamicForm insuranceType={insuranceType} />
            </Box>
          )}
        </Box>
      )}
      
      {tabIndex === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            My Applications
          </Typography>
          <SubmissionsList />
        </Box>
      )}
    </Container>
  );
}
