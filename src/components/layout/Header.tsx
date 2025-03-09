'use client';

import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Container,
  Tooltip
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import useSettings from '@/smart-insurance/hooks/useSettings';

/**
 * Main application header with dark mode toggle
 */
export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { themeMode, onToggleMode } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDarkMode = themeMode === 'dark';

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Smart Insurance Portal
          </Typography>

          {/* Dark Mode Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
              <IconButton
                onClick={onToggleMode}
                color="inherit"
                aria-label="toggle dark mode"
                edge="end"
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 