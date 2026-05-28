import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  // Appearance
  language: "en",
  density: "comfortable",
  landingPage: "/dashboard",
  currency: "INR",

  // AI Preferences
  forecastHorizon: "6", // months
  confidenceThreshold: 85, // percentage
  modelSelection: "Ensemble", // LGBM, XGBoost, Ensemble
  coldStartHandling: true,
  autoRetrain: "weekly",
  optunaTrials: 50,
  autoReorder: true,
  predictiveLevel: "aggressive",

  // Notifications
  lowStockThreshold: 50,
  demandSurgeAlerts: true,
  reorderFrequency: "daily",

  // Region
  activeCities: ["Mumbai", "Delhi", "Bangalore", "Pune"],
  defaultRegion: "Mumbai"
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("chainsphere_settings");
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem("chainsphere_settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCity = (city) => {
    setSettings((prev) => {
      const activeCities = prev.activeCities.includes(city)
        ? prev.activeCities.filter((c) => c !== city)
        : [...prev.activeCities, city];
      return { ...prev, activeCities };
    });
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, toggleCity, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
