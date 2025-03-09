'use client';

import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  Grid2
} from '@mui/material';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  SupportAgent as SupportIcon
} from '@mui/icons-material';

// Feature data
const features = [
  {
    icon: <SecurityIcon color="primary" fontSize="large" />,
    title: 'Comprehensive Coverage',
    description: 'Get complete protection for all your valuable assets'
  },
  {
    icon: <SpeedIcon color="primary" fontSize="large" />,
    title: 'Fast Processing',
    description: 'Quick application process and rapid claims settlement'
  },
  {
    icon: <SupportIcon color="primary" fontSize="large" />,
    title: '24/7 Support',
    description: 'Our customer service team is always available to help'
  }
];

/**
 * Feature section component for the homepage
 */
export function FeatureSection() {

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Why Choose Smart Insurance?
      </Typography>
      <Grid2 container spacing={3}>
        {features.map((feature, index) => (
          <Grid2 size={{ xs: 12, md: 4 }} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Paper>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
} 