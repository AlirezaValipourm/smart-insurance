'use client';

import { Box, Container, Typography, Link } from '@mui/material';

/**
 * Footer component for the application
 */
export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="https://devotel.io/">
            Devotel
          </Link>
          {' - Smart Insurance Portal'}
        </Typography>
      </Container>
    </Box>
  );
} 