// LAYOUT
// ----------------------------------------------------------------------

import { ThemeLayout, ThemeStretch } from "../../types/SettingTypes";

import { ThemeColorPresets } from "../../types/SettingTypes";

import { ThemeDirection } from "../../types/SettingTypes";

import { ThemeMode } from "../../types/SettingTypes";

// SETTINGS
// ----------------------------------------------------------------------

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: 'themeMode',
  themeDirection: 'themeDirection',
  themeColorPresets: 'themeColorPresets',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch',
};

export const defaultSettings = {
  themeMode: 'light' as ThemeMode,
  themeDirection: 'ltr' as ThemeDirection,
  themeColorPresets: 'default' as ThemeColorPresets,
  themeLayout: 'horizontal' as ThemeLayout,
  themeStretch: false as ThemeStretch,
};
