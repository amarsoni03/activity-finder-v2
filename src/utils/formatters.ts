/**
 * Utility functions for Moscow City formatting (Currency, Metro Badges, Distances)
 */

export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Free Trial';
  return `${amount.toLocaleString('ru-RU')} ₽`;
}

export function formatPhone(phone: string): string {
  if (!phone) return '+7 (495) 789-01-23';
  return phone;
}

export { getMetroLineColor } from '../features/metro/utils/metroUtils';
