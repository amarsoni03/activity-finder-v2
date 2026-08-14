import { METRO_LINES, METRO_STATIONS } from '../data/metroData';
import { MetroLine, MetroStation } from '../types';

export function getMetroLineById(lineId: string): MetroLine | undefined {
  return METRO_LINES.find((l) => l.id === lineId);
}

export function getMetroStationById(stationId: string): MetroStation | undefined {
  return METRO_STATIONS.find((s) => s.id === stationId);
}

export function getStationsByLineId(lineId: string): MetroStation[] {
  if (lineId === 'all') return METRO_STATIONS;
  return METRO_STATIONS.filter((s) => s.lineId === lineId);
}

export function getMetroLineColor(lineId: string): string {
  const line = METRO_LINES.find((l) => l.id === lineId);
  return line ? line.color : '#64748B';
}
