'use client';

import { useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useFormData } from '../hooks/useFormData';
import { DynamicForm } from '../components/forms/DynamicForm'; import { SubmissionsList } from '../components/submissions/SubmissionsList';
import { WelcomeBanner } from '../components/home/WelcomeBanner';
import { FeatureSection } from '../components/home/FeatureSection';
import { InsuranceOptions } from '../components/home/InsuranceOptions';
import { FAQ } from '../components/home/FAQ';
import { CallToAction } from '../components/home/CallToAction';
import { FormHeader } from '../components/forms/FormHeader';
import { SubmissionsHeader } from '../components/submissions/SubmissionsHeader';
import { MainTabs } from '../components/layout/MainTabs';

export function Home() {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { forms, isLoading, error } = useFormData();

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSelectedFormId(null);
  };

  // Handle form selection
  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
    // Scroll to top when form is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll to insurance options
  const handleScrollToOptions = () => {
    document.getElementById('insurance-options')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!selectedFormId && tabIndex === 0 && (
        <WelcomeBanner onGetStarted={handleScrollToOptions} />
      )}

      <MainTabs
        tabIndex={tabIndex}
        isMobile={isMobile}
        onTabChange={handleTabChange}
      />

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
              <FeatureSection />

              <InsuranceOptions
                forms={forms}
                onSelectForm={handleFormSelect}
              />

              <Box sx={{ mt: 4 }}>
                <FAQ />
              </Box>

              <Box sx={{ mt: 4, mb: 4 }}>
                <CallToAction onGetStarted={handleScrollToOptions} />
              </Box>
            </Box>
          ) : (
            <Box>
              <FormHeader
                title={forms?.find(form => form.formId === selectedFormId)?.title || ''}
                onBack={() => setSelectedFormId(null)}
              />
              <DynamicForm formId={selectedFormId} />
            </Box>
          )}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          <SubmissionsHeader />
          <SubmissionsList />
        </Box>
      )}
    </Container>
  );
}

export default Home;
