'use client';

import { Box, Container, Typography, Link, Divider } from '@mui/material';
import useSettings from '@/smart-insurance/hooks/useSettings';

/**
 * Application footer component
 */
export default function Footer() {
  const { themeMode } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        bgcolor: themeMode === 'dark' ? 'background.paper' : 'grey.100',
        borderTop: 1,
        borderColor: 'divider',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Smart Insurance Portal. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mt: { xs: 2, sm: 0 }
            }}
          >
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link href="#" color="inherit" underline="hover" variant="body2">
              Contact Us
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 