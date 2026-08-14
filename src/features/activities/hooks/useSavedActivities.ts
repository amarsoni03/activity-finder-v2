import { useState, useEffect, useCallback } from 'react';
import { loadStoredSavedIds, saveStoredSavedIds } from '../services/activityStorage';

export function useSavedActivities() {
  const [savedIds, setSavedIds] = useState<string[]>(() => loadStoredSavedIds());

  useEffect(() => {
    saveStoredSavedIds(savedIds);
  }, [savedIds]);

  const toggleSave = useCallback((activityId: string): { isSaved: boolean } => {
    let isSaved = false;
    setSavedIds((prev) => {
      if (prev.includes(activityId)) {
        isSaved = false;
        return prev.filter((id) => id !== activityId);
      } else {
        isSaved = true;
        return [...prev, activityId];
      }
    });
    return { isSaved };
  }, []);

  return {
    savedIds,
    toggleSave,
  };
}
