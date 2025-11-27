/**
 * Eğitmen bilgileri
 */
export interface Instructor {
  id: string;
  name: string;
  tcNo: string;
  department: string;
}

/**
 * Bordro hesaplamaları
 */
export interface PayrollCalculations {
  grossIncome: number;
  stampTax: number;
  incomeTax: number;
  netIncome: number;
}

/**
 * Bordro bilgileri
 */
export interface Payroll {
  id: string;
  instructorId: string;
  month: number;
  year: number;
  workingHours: number;
  workType: 'daytime' | 'nighttime';
  calculatedDays: number;
  premiumDays: number;
  hourlyRate: number;
  institution: string;
  department: string;
  calculations: PayrollCalculations;
  createdAt: string;
}
