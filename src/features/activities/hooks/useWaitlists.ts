import { useState, useEffect, useCallback } from 'react';
import { WaitlistEntry } from '../types';
import { loadStoredWaitlists, saveStoredWaitlists } from '../services/activityStorage';

export function useWaitlists() {
  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>(() => loadStoredWaitlists());

  useEffect(() => {
    saveStoredWaitlists(waitlists);
  }, [waitlists]);

  const joinWaitlist = useCallback((activityId: string, user: { userName: string; userEmail: string; userPhone?: string }) => {
    const newEntry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      activityId,
      activityTitle: 'Activity',
      userName: user.userName,
      userEmail: user.userEmail,
      userPhone: user.userPhone,
      position: 1,
      joinedAt: 'Just now',
      status: 'pending',
    };
    setWaitlists((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const notifyWaitlistUser = useCallback((idOrActivityId: string, email?: string): WaitlistEntry | undefined => {
    let notifiedItem: WaitlistEntry | undefined;
    setWaitlists((prev) =>
      prev.map((w) => {
        if (w.id === idOrActivityId || (w.activityId === idOrActivityId && (!email || w.userEmail === email))) {
          notifiedItem = { ...w, status: 'notified' as const };
          return notifiedItem;
        }
        return w;
      })
    );
    return notifiedItem;
  }, []);

  return {
    waitlists,
    joinWaitlist,
    notifyWaitlistUser,
  };
}
