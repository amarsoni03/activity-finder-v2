import { useState, useCallback } from 'react';
import { UserPreferences } from '../types';
import { getUserPreferences, saveUserPreferences } from '../utils/personalization';

export function useUserPreferences() {
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => getUserPreferences());

  const updatePreferences = useCallback((newPrefs: UserPreferences) => {
    setUserPrefs(newPrefs);
    saveUserPreferences(newPrefs);
  }, []);

  return {
    preferences: userPrefs,
    userPrefs,
    updatePreferences,
    savePreferences: updatePreferences,
  };
}
