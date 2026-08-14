export interface MetroLine {
  id: string;
  name: string;
  color: string; // hex code or tailwind class
  badgeBg: string;
  badgeText: string;
}

export interface MetroStation {
  id: string;
  name: string;
  lineId: string;
  lineName: string;
  zone?: string;
  xRatio?: number; // 0-100 percentage for custom map representation
  yRatio?: number;
}
