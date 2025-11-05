"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { DietaryPreference, ScanHistoryItem, UserPreferences } from '@/lib/types';
import { Product } from '@/lib/types';

interface AppContextType {
  preferences: UserPreferences;
  setPreferences: (newPreferences: UserPreferences) => void;
  toggleDietaryRestriction: (restriction: DietaryPreference) => void;
  scanHistory: ScanHistoryItem[];
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  dietaryRestrictions: [],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<UserPreferences>(defaultPreferences);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem('nutriscan-preferences');
      if (storedPrefs) {
        setPreferencesState(JSON.parse(storedPrefs));
      }
      const storedHistory = localStorage.getItem('nutriscan-history');
      if (storedHistory) {
        setScanHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);
  
  const setPreferences = (newPreferences: UserPreferences) => {
    setPreferencesState(newPreferences);
    if(isLoaded) {
      localStorage.setItem('nutriscan-preferences', JSON.stringify(newPreferences));
    }
  };

  const toggleDietaryRestriction = (restriction: DietaryPreference) => {
    setPreferencesState(prev => {
        const newRestrictions = prev.dietaryRestrictions.includes(restriction)
            ? prev.dietaryRestrictions.filter(r => r !== restriction)
            : [...prev.dietaryRestrictions, restriction];
        const newPrefs = { ...prev, dietaryRestrictions: newRestrictions };
        if(isLoaded) {
          localStorage.setItem('nutriscan-preferences', JSON.stringify(newPrefs));
        }
        return newPrefs;
    });
  }

  const addToHistory = useCallback((product: Product) => {
    setScanHistory(prevHistory => {
      const newItem: ScanHistoryItem = {
        barcode: product.code,
        productName: product.product_name_en || product.product_name || 'Unknown Product',
        imageUrl: product.image_url,
        scannedAt: new Date().toISOString(),
      };
      const newHistory = [newItem, ...prevHistory.filter(item => item.barcode !== product.code)].slice(0, 50);
      if(isLoaded) {
        localStorage.setItem('nutriscan-history', JSON.stringify(newHistory));
      }
      return newHistory;
    });
  }, [isLoaded]);

  const clearHistory = () => {
    setScanHistory([]);
    if(isLoaded) {
      localStorage.removeItem('nutriscan-history');
    }
  };
  
  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem('nutriscan-preferences', JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem('nutriscan-history', JSON.stringify(scanHistory));
    }
  }, [scanHistory, isLoaded]);


  return (
    <AppContext.Provider value={{ preferences, setPreferences, toggleDietaryRestriction, scanHistory, addToHistory, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
