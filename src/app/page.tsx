'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import DynamicForm from '../components/forms/DynamicForm';
import SubmissionsList from '../components/submissions/SubmissionsList';
import { useFormData } from '../hooks/useFormData';

/**
 * Main page component
 * @returns The main page component
 */
export default function Home() {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get forms data
  const { forms, isLoading, error } = useFormData();

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    // Reset selected form when changing tabs
    setSelectedFormId(null);
  };

  // Handle form selection
  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
  };

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
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              Error loading insurance forms: {error instanceof Error ? error.message : 'Unknown error'}
            </Alert>
          ) : !selectedFormId ? (
            <Box>
              <Typography variant="h5" gutterBottom>
                Select Insurance Type
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                  gap: 2,
                  mt: 3
                }}
              >
                {forms?.map((form) => (
                  <Card key={form.formId} elevation={3}>
                    <CardActionArea onClick={() => handleFormSelect(form.formId)}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {form.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to apply for {form.title.toLowerCase()}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  {forms?.find(form => form.formId === selectedFormId)?.title}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedFormId(null)}
                >
                  Change Type
                </Button>
              </Box>
              <DynamicForm formId={selectedFormId} />
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
