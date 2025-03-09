"use client";
import { useContext } from 'react';
import { SettingsContext } from '@/smart-insurance/contexts/SettingsContext';
// ----------------------------------------------------------------------

export const useSettings = () => useContext(SettingsContext);
