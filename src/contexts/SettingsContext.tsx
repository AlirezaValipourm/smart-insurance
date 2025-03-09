"use client";
import Cookies from 'js-cookie';
import { ReactNode, createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
// utils
import getColorPresets, { colorPresets, defaultPreset } from '@/smart-insurance/utils/getColorPresets';
// @type
import {
  ThemeMode,
  ThemeLayout,
  ThemeDirection,
  ThemeColorPresets,
  SettingsContextProps,
  SettingsValueProps,
} from '@/smart-insurance/types/SettingTypes';
// config
import { defaultSettings, cookiesKey, cookiesExpires } from '@/smart-insurance/config/mui/config';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  onChangeMode: () => { },
  onToggleMode: () => { },
  onChangeDirection: () => { },
  onChangeColor: () => { },
  onToggleStretch: () => { },
  onChangeLayout: () => { },
  onResetSetting: () => { },
  setColor: defaultPreset,
  colorOption: [],
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
};

function SettingsProvider({
  children,
}: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);
  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    });
  };

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeDirection: (event.target as HTMLInputElement).value as ThemeDirection,
    });
  };

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeColorPresets: (event.target as HTMLInputElement).value as ThemeColorPresets,
    });
  };

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeLayout: (event.target as HTMLInputElement).value as ThemeLayout,
    });
  };

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    });
  };

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      themeStretch: initialState.themeStretch,
      themeDirection: initialState.themeDirection,
      themeColorPresets: initialState.themeColorPresets,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        // Mode
        onChangeMode,
        onToggleMode,
        // Direction
        onChangeDirection,
        // Color
        onChangeColor,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
        // Stretch
        onToggleStretch,
        // Navbar Horizontal
        onChangeLayout,
        // Reset Setting
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

// ----------------------------------------------------------------------
function useSettingCookies(
  defaultSettings: SettingsValueProps
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);
  const [isClient, setIsClient] = useState(false);

  // Only run on client-side after initial render
  useEffect(() => {
    setIsClient(true);
    
    // Load settings from cookies on client-side only
    const themeMode = Cookies.get(cookiesKey.themeMode) as ThemeMode;
    const themeDirection = Cookies.get(cookiesKey.themeDirection) as ThemeDirection;
    const themeColorPresets = Cookies.get(cookiesKey.themeColorPresets) as ThemeColorPresets;
    const themeLayout = Cookies.get(cookiesKey.themeLayout) as ThemeLayout;
    const themeStretchStr = Cookies.get(cookiesKey.themeStretch);
    
    // Only update settings if we have values in cookies
    if (themeMode || themeDirection || themeColorPresets || themeLayout || themeStretchStr) {
      setSettings({
        ...defaultSettings,
        ...(themeMode && { themeMode }),
        ...(themeDirection && { themeDirection }),
        ...(themeColorPresets && { themeColorPresets }),
        ...(themeLayout && { themeLayout }),
        ...(themeStretchStr && { themeStretch: JSON.parse(themeStretchStr) }),
      });
    }
  }, []);

  const onChangeSetting = () => {
    // Only save cookies on the client side
    if (isClient) {
      Cookies.set(cookiesKey.themeMode, settings.themeMode, { expires: cookiesExpires });

      Cookies.set(cookiesKey.themeDirection, settings.themeDirection, { expires: cookiesExpires });

      Cookies.set(cookiesKey.themeColorPresets, settings.themeColorPresets, {
        expires: cookiesExpires,
      });

      Cookies.set(cookiesKey.themeLayout, settings.themeLayout, {
        expires: cookiesExpires,
      });

      Cookies.set(cookiesKey.themeStretch, JSON.stringify(settings.themeStretch), {
        expires: cookiesExpires,
      });
    }
  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, isClient]);

  return [settings, setSettings];
}
