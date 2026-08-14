import { useState, useEffect, useCallback } from 'react';
import { Activity, Review } from '../types';
import { loadStoredActivities, saveStoredActivities } from '../services/activityStorage';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>(() => loadStoredActivities());

  useEffect(() => {
    saveStoredActivities(activities);
  }, [activities]);

  const addOrUpdateActivity = useCallback((newAct: Activity): { isEdit: boolean } => {
    let isEdit = false;
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === newAct.id);
      isEdit = exists;
      const updated = exists
        ? prev.map((a) => (a.id === newAct.id ? newAct : a))
        : [newAct, ...prev];
      return updated;
    });
    return { isEdit };
  }, []);

  const decrementSeat = useCallback((activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const currentSeats = act.seatsLeft ?? act.availableSeats ?? 4;
          const nextSeats = Math.max(0, currentSeats - 1);
          return {
            ...act,
            seatsLeft: nextSeats,
            availableSeats: nextSeats,
          };
        }
        return act;
      })
    );
  }, []);

  const incrementSeat = useCallback((activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const currentSeats = act.seatsLeft ?? act.availableSeats ?? 0;
          const maxCap = act.totalSeats || act.capacity || 10;
          const nextSeats = Math.min(maxCap, currentSeats + 1);
          return {
            ...act,
            seatsLeft: nextSeats,
            availableSeats: nextSeats,
          };
        }
        return act;
      })
    );
  }, []);

  const addReview = useCallback((activityId: string, rating: number, comment: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const currentCount = act.reviewCount || 0;
          const currentRating = act.rating || 5;
          const newCount = currentCount + 1;
          const newAvgRating = parseFloat(
            ((currentRating * currentCount + rating) / newCount).toFixed(2)
          );

          const newRev: Review = {
            id: `rev-${Date.now()}`,
            activityId,
            userName: 'Alex Morgan',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            rating,
            comment,
            date: 'Just now',
            isVerifiedAttendee: true,
            attendedDate: 'Attended August 2026',
            helpfulCount: 1,
          };

          return {
            ...act,
            rating: newAvgRating,
            reviewCount: newCount,
            userReviews: [newRev, ...(act.userReviews || [])],
          };
        }
        return act;
      })
    );
  }, []);

  const addActivity = useCallback((act: Activity) => {
    addOrUpdateActivity(act);
  }, [addOrUpdateActivity]);

  const updateActivity = useCallback((id: string, act: Activity) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? act : a)));
  }, []);

  return {
    activities,
    setActivities,
    addActivity,
    updateActivity,
    addOrUpdateActivity,
    decrementSeat,
    incrementSeat,
    addReview,
  };
}
