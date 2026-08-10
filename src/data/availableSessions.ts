import { Activity } from '../types';

export interface AvailableSession {
  id: string;
  dateStr: string;
  dateLabel: string;
  shortDateLabel: string;
  dayOfWeek: string;
  timeSlot: string;
  startTimeStr: string;
  endTimeStr: string;
  remainingSeats: number;
  totalSeats: number;
  isFull: boolean;
  isEarliestAvailable?: boolean;
  startDateTime: Date;
  endDateTime: Date;
  formattedFull: string;
}

export interface DayGroup {
  dateStr: string;
  dateLabel: string;
  shortDateLabel: string;
  dayOfWeek: string;
  isToday: boolean;
  isTomorrow: boolean;
  sessions: AvailableSession[];
}

export function generateMockAvailableSessions(activity?: Activity): DayGroup[] {
  const dayGroups: DayGroup[] = [];
  const baseDate = new Date();
  let foundEarliest = false;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + i);

    const year = currentDate.getFullYear();
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateNumStr = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dateNumStr}`;

    const dayName = dayNames[currentDate.getDay()];
    const monthName = monthNames[currentDate.getMonth()];
    const dateNum = currentDate.getDate();

    const shortDateLabel = `${dayName.slice(0, 3)}, ${monthName} ${dateNum}`;
    const dateLabel = `${dayName}, ${monthName} ${dateNum}`;

    const mainTimeRange = activity?.schedule?.timeRange || '18:30 - 20:00';

    // Deterministic seat distribution across 14 days
    const seatPattern = [
      [0, 3, 0], // Day 0: 0 full, 3 available (Earliest Available!), 0 full
      [4, 1],    // Day 1: 4 available, 1 left
      [0, 2],    // Day 2: 0 full, 2 left
      [6, 5],    // Day 3
      [1, 0],    // Day 4
      [3, 4],    // Day 5
      [0, 0],    // Day 6: all booked
      [5, 2],    // Day 7
      [2, 1],    // Day 8
      [0, 4],    // Day 9
      [3, 3],    // Day 10
      [1, 5],    // Day 11
      [0, 2],    // Day 12
      [4, 1],    // Day 13
    ];

    const dayPattern = seatPattern[i % seatPattern.length];

    const slotConfigs = [
      { start: '10:00', end: '11:30', timeSlot: '10:00 AM - 11:30 AM', seats: dayPattern[0] ?? 4 },
      { start: '18:30', end: '20:00', timeSlot: mainTimeRange, seats: dayPattern[1] ?? 2 },
    ];

    if (i % 2 === 0) {
      slotConfigs.push({
        start: '14:30',
        end: '16:00',
        timeSlot: '02:30 PM - 04:00 PM',
        seats: dayPattern[2] ?? 3,
      });
    }

    const sessions: AvailableSession[] = slotConfigs.map((cfg, idx) => {
      const [sh, sm] = cfg.start.split(':').map(Number);
      const [eh, em] = cfg.end.split(':').map(Number);

      const startDateTime = new Date(currentDate);
      startDateTime.setHours(sh || 10, sm || 0, 0, 0);

      const endDateTime = new Date(currentDate);
      endDateTime.setHours(eh || 11, em || 30, 0, 0);

      const remainingSeats = cfg.seats;
      const isFull = remainingSeats === 0;

      let isEarliestAvailable = false;
      if (!isFull && !foundEarliest) {
        isEarliestAvailable = true;
        foundEarliest = true;
      }

      return {
        id: `sess-${dateStr}-${idx}-${cfg.start.replace(':', '')}`,
        dateStr,
        dateLabel,
        shortDateLabel,
        dayOfWeek: dayName,
        timeSlot: cfg.timeSlot,
        startTimeStr: cfg.start,
        endTimeStr: cfg.end,
        remainingSeats,
        totalSeats: 8,
        isFull,
        isEarliestAvailable,
        startDateTime,
        endDateTime,
        formattedFull: `${dateLabel}, ${year} • ${cfg.timeSlot}`,
      };
    });

    dayGroups.push({
      dateStr,
      dateLabel,
      shortDateLabel,
      dayOfWeek: dayName,
      isToday: i === 0,
      isTomorrow: i === 1,
      sessions,
    });
  }

  return dayGroups;
}

// Global default mock constant as required by prompt
export const availableSessions: DayGroup[] = generateMockAvailableSessions();
