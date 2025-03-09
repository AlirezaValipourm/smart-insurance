'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  useTheme
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

interface WelcomeBannerProps {
  onGetStarted: () => void;
}

/**
 * Welcome banner component for the homepage
 */
export function WelcomeBanner({ onGetStarted }: WelcomeBannerProps) {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={1000}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.background.paper})` 
            : `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.background.paper})`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Smart Insurance
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, maxWidth: '80%' }}>
            Protect what matters most with our comprehensive insurance solutions
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={onGetStarted}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Box>
        <Box 
          sx={{ 
            position: 'absolute', 
            right: { xs: -100, md: 0 }, 
            bottom: 0, 
            opacity: 0.8,
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <SecurityIcon sx={{ fontSize: 180, opacity: 0.2 }} />
        </Box>
      </Paper>
    </Fade>
  );
} 