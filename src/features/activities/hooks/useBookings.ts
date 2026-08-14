import { useState, useEffect, useCallback } from 'react';
import { Booking, Activity } from '../types';
import { loadStoredBookings, saveStoredBookings } from '../services/activityStorage';

export function useBookings(onSeatBooked?: (activityId: string) => void, onSeatCancelled?: (activityId: string) => void) {
  const [bookings, setBookings] = useState<Booking[]>(() => loadStoredBookings());

  useEffect(() => {
    saveStoredBookings(bookings);
  }, [bookings]);

  const confirmBooking = useCallback(
    (
      activity: Activity,
      details: { userName: string; userEmail: string; userPhone: string; date: string }
    ): Booking => {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        activityId: activity.id,
        activityTitle: activity.title,
        category: activity.category,
        metroStationName: activity.metroStationName,
        scheduleText: `${activity.schedule?.specificDaysText || 'Schedule'} (${activity.schedule?.timeRange || activity.startTime})`,
        priceText: `${activity.price} ₽ / ${activity.priceUnit}`,
        userName: details.userName,
        userEmail: details.userEmail,
        userPhone: details.userPhone,
        selectedDate: details.date,
        bookedAt: new Date().toLocaleDateString(),
        accentColor: activity.accentColor,
      };

      setBookings((prev) => [newBooking, ...prev]);
      if (onSeatBooked) onSeatBooked(activity.id);

      return newBooking;
    },
    [onSeatBooked]
  );

  const cancelBooking = useCallback(
    (bookingId: string): Booking | undefined => {
      const found = bookings.find((b) => b.id === bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      if (found && onSeatCancelled) {
        onSeatCancelled(found.activityId);
      }
      return found;
    },
    [bookings, onSeatCancelled]
  );

  const createBooking = useCallback((bookingData: any): Booking => {
    const newBooking: Booking = {
      id: bookingData.id || `booking-${Date.now()}`,
      bookedAt: bookingData.bookedAt || new Date().toLocaleDateString(),
      ...bookingData,
    };
    setBookings((prev) => [newBooking, ...prev]);
    if (onSeatBooked && newBooking.activityId) onSeatBooked(newBooking.activityId);
    return newBooking;
  }, [onSeatBooked]);

  return {
    bookings,
    createBooking,
    confirmBooking,
    cancelBooking,
  };
}
