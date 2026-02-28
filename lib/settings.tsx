'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  geminiApiKey: string;
  firebaseConfig: string;
  stripePublishableKey: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  getGeminiKey: () => string;
  getStripeKey: () => string;
}

const defaultSettings: Settings = {
  geminiApiKey: '',
  firebaseConfig: '',
  stripePublishableKey: '',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  getGeminiKey: () => process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  getStripeKey: () => process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem('leadgenius_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setSettings(parsed), 0);
      } catch (e) {}
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('leadgenius_settings', JSON.stringify(updated));
  };

  const getGeminiKey = () => {
    return settings.geminiApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  };

  const getStripeKey = () => {
    return settings.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, getGeminiKey, getStripeKey }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
