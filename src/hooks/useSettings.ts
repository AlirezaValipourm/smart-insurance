"use client";
import { useContext } from 'react';
import { SettingsContext } from '@/smart-insurance/contexts/SettingsContext';
// ----------------------------------------------------------------------

const useSettings = () => useContext(SettingsContext);

export default useSettings;
