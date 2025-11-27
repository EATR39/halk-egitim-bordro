import type { SGKRates, TaxBracket } from '../types';

// SGK Varsayılan Oranları (2025)
export const DEFAULT_SGK_RATES: SGKRates = {
  sgkWorkerRate: 0.14, // %14 işçi payı
  sgkEmployerRate: 0.155, // %15.5 işveren payı (işsiz için)
  participantRate: 0.145, // %14.5 iştirakçi payı (emekliler için)
  unemploymentWorkerRate: 0.01, // %1 işsizlik işçi
  unemploymentEmployerRate: 0.02, // %2 işsizlik işveren
  stampTaxRate: 0.00759, // %0.759 damga vergisi
};

// 2025 Gelir Vergisi Dilimleri
export const TAX_BRACKETS_2025: TaxBracket[] = [
  { min: 0, max: 110000, rate: 0.15 },
  { min: 110000, max: 230000, rate: 0.20 },
  { min: 230000, max: 580000, rate: 0.27 },
  { min: 580000, max: 3000000, rate: 0.35 },
  { min: 3000000, max: Infinity, rate: 0.40 },
];

// Asgari Ücret (2025 - Brüt)
export const MINIMUM_WAGE_2025 = 22104;

// Varsayılan saat ücreti
export const DEFAULT_HOURLY_RATE = 150;

// LocalStorage Anahtarları
export const STORAGE_KEYS = {
  INSTRUCTORS: 'bordro_instructors',
  PAYROLLS: 'bordro_payrolls',
  SGK_RATES: 'bordro_sgk_rates',
};

// Sayfa Başlıkları
export const PAGE_TITLES = {
  DASHBOARD: 'Gösterge Paneli',
  INSTRUCTORS: 'Usta Öğreticiler',
  PAYROLLS: 'Bordrolar',
  SGK_RATES: 'SGK Oranları',
  SETTINGS: 'Ayarlar',
};

// Aylar (Türkçe)
export const MONTHS_TR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

// Mevcut dönem (YYYY-MM formatında)
export function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Yıl listesi
export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = currentYear - 2; i <= currentYear + 1; i++) {
    years.push(i);
  }
  return years;
}
