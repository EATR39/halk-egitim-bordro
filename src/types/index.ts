// Usta Öğretici Tipi
export interface Instructor {
  id: string;
  tcNo: string;
  firstName: string;
  lastName: string;
  iban: string;
  isRetired: boolean; // Emekli mi?
  hourlyRate: number; // Saat ücreti (brüt)
  createdAt: string;
  updatedAt: string;
}

// Bordro Tipi
export interface Payroll {
  id: string;
  instructorId: string;
  instructorName: string;
  period: string; // "2025-01" formatında
  workDays: number;
  workHours: number;
  hourlyRate: number;
  grossAmount: number; // Brüt ücret
  sgkWorkerPremium: number; // SGK işçi payı
  sgkEmployerPremium: number; // SGK işveren payı (iştirakçi payı dahil)
  unemploymentWorkerPremium: number; // İşsizlik işçi payı
  unemploymentEmployerPremium: number; // İşsizlik işveren payı
  incomeTax: number; // Gelir vergisi
  stampTax: number; // Damga vergisi
  totalDeductions: number; // Toplam kesintiler
  netAmount: number; // Net ücret
  cumulativeGross: number; // Yıllık kümülatif brüt (vergi hesabı için)
  isRetired: boolean;
  createdAt: string;
}

// SGK Oranları
export interface SGKRates {
  sgkWorkerRate: number; // SGK işçi payı oranı
  sgkEmployerRate: number; // SGK işveren payı oranı
  participantRate: number; // İştirakçi payı oranı (emekliler için)
  unemploymentWorkerRate: number; // İşsizlik işçi payı
  unemploymentEmployerRate: number; // İşsizlik işveren payı
  stampTaxRate: number; // Damga vergisi oranı
}

// Vergi Dilimi
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

// Dashboard İstatistikleri
export interface DashboardStats {
  totalInstructors: number;
  activeInstructors: number;
  retiredInstructors: number;
  totalPayrolls: number;
  currentMonthPayrolls: number;
  totalGrossThisMonth: number;
  totalNetThisMonth: number;
}

// LocalStorage Veri Yapısı
export interface StorageData {
  instructors: Instructor[];
  payrolls: Payroll[];
  sgkRates: SGKRates;
  version: string;
  exportedAt: string;
}

// Form State Tipleri
export interface InstructorFormData {
  tcNo: string;
  firstName: string;
  lastName: string;
  iban: string;
  isRetired: boolean;
  hourlyRate: string;
}

export interface PayrollFormData {
  instructorId: string;
  period: string;
  workDays: string;
  workHours: string;
}
