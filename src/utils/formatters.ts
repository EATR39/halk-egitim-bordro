import { MONTHS_TR } from './constants';

// Para formatı (TL)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Sayı formatı
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Yüzde formatı
export function formatPercent(rate: number): string {
  return `%${(rate * 100).toFixed(2)}`;
}

// TC Kimlik formatı (11111111111 -> 111 111 111 11)
export function formatTCNo(tcNo: string): string {
  const cleaned = tcNo.replace(/\D/g, '');
  if (cleaned.length !== 11) return tcNo;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
}

// IBAN formatı (TR12 3456 7890 1234 5678 9012 34)
export function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  const parts: string[] = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.slice(i, i + 4));
  }
  return parts.join(' ');
}

// Tarih formatı
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Tarih ve saat formatı
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Dönem formatı (2025-01 -> Ocak 2025)
export function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${MONTHS_TR[monthIndex]} ${year}`;
}

// Kısa dönem formatı (2025-01 -> 01/2025)
export function formatPeriodShort(period: string): string {
  const [year, month] = period.split('-');
  return `${month}/${year}`;
}

// Ad soyad formatı
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
