'use client';

import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

interface CallToActionProps {
  onGetStarted: () => void;
}

/**
 * Call to Action component with a prominent button
 */
export function CallToAction({ onGetStarted }: CallToActionProps) {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 2,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.background.paper} 70%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.background.paper} 70%)`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Ready to Get Protected?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
              Join thousands of satisfied customers who trust Smart Insurance for their protection needs
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Now
            </Button>
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              right: { xs: -100, md: 40 },
              bottom: -20,
              opacity: 0.1,
              transform: 'rotate(15deg)',
              display: { xs: 'none', md: 'block' }
            }}
          >
            <SecurityIcon sx={{ fontSize: 200 }} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 