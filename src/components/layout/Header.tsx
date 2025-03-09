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
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useSettings } from '@/smart-insurance/hooks/useSettings';

/**
 * Main application header with theme selection
 */
export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { 
    themeMode, 
    onToggleMode, 
    onChangeMode,
    themeColorPresets,
    onChangeColor,
    colorOption
  } = useSettings();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenu, setThemeMenu] = useState<null | HTMLElement>(null);

  const isDarkMode = themeMode === 'dark';
  
  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenu(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenu(null);
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    onChangeMode({ target: { value: mode } } as React.ChangeEvent<HTMLInputElement>);
    handleThemeMenuClose();
  };

  const handleColorChange = (color: string) => {
    onChangeColor({ target: { value: color } } as React.ChangeEvent<HTMLInputElement>);
    handleThemeMenuClose();
  };

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

          {/* Theme Settings */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Theme settings">
              <IconButton
                onClick={handleThemeMenuOpen}
                color="inherit"
                aria-label="theme settings"
                edge="end"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={themeMenu}
              open={Boolean(themeMenu)}
              onClose={handleThemeMenuClose}
              PaperProps={{
                elevation: 3,
                sx: { width: 220, maxWidth: '100%' }
              }}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
                Theme Settings
              </Typography>
              <Divider />
              
              {/* Mode Selection */}
              <MenuItem 
                onClick={() => handleModeChange('light')}
                sx={{ py: 1 }}
              >
                <ListItemIcon>
                  <LightModeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Light Mode</ListItemText>
                {themeMode === 'light' && <CheckIcon fontSize="small" color="primary" />}
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleModeChange('dark')}
                sx={{ py: 1 }}
              >
                <ListItemIcon>
                  <DarkModeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Dark Mode</ListItemText>
                {themeMode === 'dark' && <CheckIcon fontSize="small" color="primary" />}
              </MenuItem>
              
              <Divider />
              
              {/* Color Presets */}
              <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block' }}>
                Color Presets
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 2, py: 1 }}>
                {colorOption.map((color) => (
                  <Tooltip key={color.name} title={color.name}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: color.value,
                        border: `solid 2px ${color.name === themeColorPresets ? theme.palette.primary.main : 'transparent'}`,
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                          boxShadow: `0 0 0 2px ${theme.palette.text.disabled}`
                        }
                      }}
                      onClick={() => handleColorChange(color.name)}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 