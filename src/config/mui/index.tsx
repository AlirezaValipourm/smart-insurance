"use client";
import { ReactNode, useEffect } from 'react';
// @mui
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { useSettings } from '@/smart-insurance/hooks/useSettings';
import getColorPresets from '@/smart-insurance/utils/getColorPresets';
import palette from '@/smart-insurance/config/mui/palette';
import typography from '@/smart-insurance/config/mui/typography';
import breakpoints from '@/smart-insurance/config/mui/breakpoints';
import componentsOverride from '@/smart-insurance/config/mui/overrides';
import shadows, { customShadows } from '@/smart-insurance/config/mui/shadows';
// rtl ---------------
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const {
    themeMode,
    themeDirection,
    themeColorPresets
  } = useSettings();

  const isLight = themeMode === 'light';

  // Update document direction only after component is mounted
  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  // Create theme options
  const themeOptions: ThemeOptions = {
    palette: {
      ...palette[isLight ? 'light' : 'dark'],
      primary: getColorPresets(themeColorPresets)
    },
    typography,
    breakpoints,
    shape: { borderRadius: 8 },
    direction: themeDirection,
    shadows: isLight ? shadows.light : shadows.dark,
    customShadows: isLight ? customShadows.light : customShadows.dark,
  }

  // Create theme
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);


  // Create cache with appropriate RTL settings
  const cache = createCache({
    key: themeDirection === 'rtl' ? 'muirtl' : 'mui',
    stylisPlugins: themeDirection === 'rtl' ? [rtlPlugin] : [],
  });

  return (
    <CacheProvider value={cache}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </CacheProvider>
  );
}