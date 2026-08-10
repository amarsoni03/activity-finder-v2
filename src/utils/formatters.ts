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

export function getMetroLineColor(lineId: string): string {
  switch (lineId) {
    case 'red-line':
      return '#EF4444'; // Sokolnicheskaya (Red)
    case 'green-line':
      return '#10B981'; // Zamoskvoretskaya (Green)
    case 'blue-line':
      return '#2563EB'; // Arbatsko-Pokrovskaya (Dark Blue)
    case 'brown-line':
      return '#9A3412'; // Koltsevaya Circle Line (Brown)
    case 'purple-line':
      return '#9333EA'; // Tagansko-Krasnopresnenskaya (Purple)
    case 'turquoise-line':
      return '#06B6D4'; // Bolshaya Koltsevaya BKL (Turquoise)
    case 'mcc-line':
      return '#E11D48'; // Moscow Central Circle MCC (Red-White)
    default:
      return '#64748B';
  }
}
