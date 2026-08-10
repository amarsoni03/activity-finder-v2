import { MetroLine, MetroStation } from '../types';

export const METRO_LINES: MetroLine[] = [
  {
    id: 'red-line',
    name: 'Line 1: Sokolnicheskaya (Red)',
    color: '#EF4444',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    badgeText: 'text-red-600',
  },
  {
    id: 'green-line',
    name: 'Line 2: Zamoskvoretskaya (Green)',
    color: '#10B981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-600',
  },
  {
    id: 'blue-line',
    name: 'Line 3: Arbatsko-Pokrovskaya (Blue)',
    color: '#2563EB',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-600',
  },
  {
    id: 'brown-line',
    name: 'Line 5: Koltsevaya Circle Line (Brown)',
    color: '#9A3412',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: 'text-amber-800',
  },
  {
    id: 'purple-line',
    name: 'Line 7: Tagansko-Krasnopresnenskaya (Purple)',
    color: '#9333EA',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-600',
  },
  {
    id: 'turquoise-line',
    name: 'Line 11: BKL Big Circle / Moscow City (Turquoise)',
    color: '#06B6D4',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badgeText: 'text-cyan-600',
  },
];

export const METRO_STATIONS: MetroStation[] = [
  // Line 1 - Red (Sokolnicheskaya)
  { id: 'okhotny-ryad', name: 'Okhotny Ryad (Red Sq)', lineId: 'red-line', lineName: 'Red Line (Sokolnicheskaya)', xRatio: 50, yRatio: 48 },
  { id: 'park-kultury', name: 'Park Kultury (Gorky Park)', lineId: 'red-line', lineName: 'Red Line (Sokolnicheskaya)', xRatio: 42, yRatio: 62 },
  { id: 'chistye-prudy', name: 'Chistye Prudy', lineId: 'red-line', lineName: 'Red Line (Sokolnicheskaya)', xRatio: 58, yRatio: 38 },
  { id: 'sokolniki', name: 'Sokolniki Park', lineId: 'red-line', lineName: 'Red Line (Sokolnicheskaya)', xRatio: 68, yRatio: 22 },
  { id: 'vorobyovy-gory', name: 'Vorobyovy Gory (MSU)', lineId: 'red-line', lineName: 'Red Line (Sokolnicheskaya)', xRatio: 35, yRatio: 72 },

  // Line 2 - Green (Zamoskvoretskaya)
  { id: 'mayakovskaya', name: 'Mayakovskaya', lineId: 'green-line', lineName: 'Green Line (Zamoskvoretskaya)', xRatio: 44, yRatio: 35 },
  { id: 'tverskaya', name: 'Tverskaya / Pushkinskaya', lineId: 'green-line', lineName: 'Green Line (Zamoskvoretskaya)', xRatio: 48, yRatio: 42 },
  { id: 'teatralnaya', name: 'Teatralnaya (Bolshoi)', lineId: 'green-line', lineName: 'Green Line (Zamoskvoretskaya)', xRatio: 52, yRatio: 50 },
  { id: 'novokuznetskaya', name: 'Novokuznetskaya (Tretyakov)', lineId: 'green-line', lineName: 'Green Line (Zamoskvoretskaya)', xRatio: 54, yRatio: 58 },
  { id: 'paveletskaya', name: 'Paveletskaya', lineId: 'green-line', lineName: 'Green Line (Zamoskvoretskaya)', xRatio: 56, yRatio: 66 },

  // Line 3 - Blue (Arbatsko-Pokrovskaya)
  { id: 'arbatskaya', name: 'Arbatskaya (Arbat)', lineId: 'blue-line', lineName: 'Blue Line (Arbatsko-Pokrovskaya)', xRatio: 42, yRatio: 50 },
  { id: 'ploshchad-revolyutsii', name: 'Ploshchad Revolyutsii', lineId: 'blue-line', lineName: 'Blue Line (Arbatsko-Pokrovskaya)', xRatio: 51, yRatio: 49 },
  { id: 'smolenskaya', name: 'Smolenskaya', lineId: 'blue-line', lineName: 'Blue Line (Arbatsko-Pokrovskaya)', xRatio: 35, yRatio: 52 },
  { id: 'kiyevskaya', name: 'Kiyevskaya Hub', lineId: 'blue-line', lineName: 'Blue Line (Arbatsko-Pokrovskaya)', xRatio: 28, yRatio: 55 },

  // Line 5 - Brown Circle Line (Koltsevaya)
  { id: 'komsomolskaya', name: 'Komsomolskaya Circle', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 62, yRatio: 33 },
  { id: 'prospekt-mira', name: 'Prospekt Mira', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 55, yRatio: 28 },
  { id: 'belorusskaya', name: 'Belorusskaya (White Sq)', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 38, yRatio: 32 },
  { id: 'krasnopresnenskaya', name: 'Krasnopresnenskaya', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 32, yRatio: 42 },
  { id: 'dobryninskaya', name: 'Dobryninskaya', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 48, yRatio: 68 },
  { id: 'taganskaya', name: 'Taganskaya Square', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 64, yRatio: 58 },
  { id: 'kurskaya', name: 'Kurskaya Art Quarter', lineId: 'brown-line', lineName: 'Brown Line (Koltsevaya)', xRatio: 65, yRatio: 46 },

  // Line 11 - Turquoise BKL & Moscow City Hub
  { id: 'delovoy-tsentr', name: 'Delovoy Tsentr (Moscow City)', lineId: 'turquoise-line', lineName: 'Turquoise Line (BKL / Moscow City)', xRatio: 24, yRatio: 48 },
  { id: 'cska', name: 'CSKA Arena', lineId: 'turquoise-line', lineName: 'Turquoise Line (BKL)', xRatio: 26, yRatio: 30 },
  { id: 'savyolovskaya', name: 'Savyolovskaya Tech', lineId: 'turquoise-line', lineName: 'Turquoise Line (BKL)', xRatio: 42, yRatio: 24 },

  // Line 7 - Purple (Tagansko-Krasnopresnenskaya)
  { id: 'pushkinskaya', name: 'Pushkinskaya', lineId: 'purple-line', lineName: 'Purple Line (Tagansko-Krasnopresnenskaya)', xRatio: 47, yRatio: 40 },
  { id: 'barrikadnaya', name: 'Barrikadnaya', lineId: 'purple-line', lineName: 'Purple Line (Tagansko-Krasnopresnenskaya)', xRatio: 33, yRatio: 41 },
  { id: 'kuznetsky-most', name: 'Kuznetsky Most', lineId: 'purple-line', lineName: 'Purple Line (Tagansko-Krasnopresnenskaya)', xRatio: 53, yRatio: 47 },
  { id: 'tushinskaya', name: 'Tushinskaya Arena', lineId: 'purple-line', lineName: 'Purple Line (Tagansko-Krasnopresnenskaya)', xRatio: 18, yRatio: 20 },
];
