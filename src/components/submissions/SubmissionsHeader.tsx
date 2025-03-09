'use client';

import {
  Typography,
  Paper
} from '@mui/material';

/**
 * Submissions header component for the submissions page
 */
export function SubmissionsHeader() {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Applications
      </Typography>
      <Typography variant="body2" color="text.secondary">
        View and track all your insurance applications in one place
      </Typography>
    </Paper>
  );
} 