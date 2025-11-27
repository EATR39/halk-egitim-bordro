import type { SGKRates, TaxBracket, Payroll, Instructor } from '../types';
import { TAX_BRACKETS_2025, DEFAULT_SGK_RATES } from './constants';

interface PayrollCalculationResult {
  grossAmount: number;
  sgkWorkerPremium: number;
  sgkEmployerPremium: number;
  unemploymentWorkerPremium: number;
  unemploymentEmployerPremium: number;
  incomeTax: number;
  stampTax: number;
  totalDeductions: number;
  netAmount: number;
}

// Artan oranlı gelir vergisi hesaplama
export function calculateIncomeTax(
  taxableIncome: number,
  previousCumulativeGross: number,
  taxBrackets: TaxBracket[] = TAX_BRACKETS_2025
): number {
  if (taxableIncome <= 0) return 0;

  let totalTax = 0;
  let remainingIncome = taxableIncome;
  let currentCumulative = previousCumulativeGross;

  for (const bracket of taxBrackets) {
    // Bu dilimde kalan miktar
    const bracketStart = Math.max(bracket.min, currentCumulative);
    const bracketEnd = bracket.max;
    
    if (currentCumulative >= bracket.max) {
      continue;
    }

    // Bu dilime düşen kısım
    const spaceInBracket = bracketEnd - bracketStart;
    const incomeInBracket = Math.min(remainingIncome, spaceInBracket);

    if (incomeInBracket > 0) {
      totalTax += incomeInBracket * bracket.rate;
      remainingIncome -= incomeInBracket;
      currentCumulative += incomeInBracket;
    }

    if (remainingIncome <= 0) break;
  }

  return Math.round(totalTax * 100) / 100;
}

// Bordro hesaplama
export function calculatePayroll(
  instructor: Instructor,
  workHours: number,
  _workDays: number,
  previousCumulativeGross: number,
  rates: SGKRates = DEFAULT_SGK_RATES
): PayrollCalculationResult {
  // Brüt ücret hesaplama
  const grossAmount = workHours * instructor.hourlyRate;

  let sgkWorkerPremium = 0;
  let sgkEmployerPremium = 0;
  let unemploymentWorkerPremium = 0;
  let unemploymentEmployerPremium = 0;

  if (instructor.isRetired) {
    // Emekli: Sadece iştirakçi (SGDP) payı ödenir, işçiden kesinti yapılmaz
    sgkWorkerPremium = 0;
    sgkEmployerPremium = grossAmount * rates.participantRate;
    unemploymentWorkerPremium = 0;
    unemploymentEmployerPremium = 0;
  } else {
    // İşsiz: Normal SGK ve işsizlik kesintileri
    sgkWorkerPremium = grossAmount * rates.sgkWorkerRate;
    sgkEmployerPremium = grossAmount * rates.sgkEmployerRate;
    unemploymentWorkerPremium = grossAmount * rates.unemploymentWorkerRate;
    unemploymentEmployerPremium = grossAmount * rates.unemploymentEmployerRate;
  }

  // Vergi matrahı (brüt - SGK işçi payı - işsizlik işçi payı)
  const taxableIncome = grossAmount - sgkWorkerPremium - unemploymentWorkerPremium;

  // Gelir vergisi (artan oranlı)
  const incomeTax = calculateIncomeTax(taxableIncome, previousCumulativeGross);

  // Damga vergisi (brüt üzerinden)
  const stampTax = grossAmount * rates.stampTaxRate;

  // Toplam kesintiler
  const totalDeductions = sgkWorkerPremium + unemploymentWorkerPremium + incomeTax + stampTax;

  // Net ücret
  const netAmount = grossAmount - totalDeductions;

  return {
    grossAmount: Math.round(grossAmount * 100) / 100,
    sgkWorkerPremium: Math.round(sgkWorkerPremium * 100) / 100,
    sgkEmployerPremium: Math.round(sgkEmployerPremium * 100) / 100,
    unemploymentWorkerPremium: Math.round(unemploymentWorkerPremium * 100) / 100,
    unemploymentEmployerPremium: Math.round(unemploymentEmployerPremium * 100) / 100,
    incomeTax: Math.round(incomeTax * 100) / 100,
    stampTax: Math.round(stampTax * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
  };
}

// Yıllık kümülatif brüt hesaplama
export function getCumulativeGross(
  payrolls: Payroll[],
  instructorId: string,
  year: number,
  beforePeriod?: string
): number {
  return payrolls
    .filter(p => {
      const [pYear] = p.period.split('-');
      const matchYear = parseInt(pYear, 10) === year;
      const matchInstructor = p.instructorId === instructorId;
      const beforeCheck = beforePeriod ? p.period < beforePeriod : true;
      return matchYear && matchInstructor && beforeCheck;
    })
    .reduce((sum, p) => sum + (p.grossAmount - p.sgkWorkerPremium - p.unemploymentWorkerPremium), 0);
}

// İşveren maliyeti hesaplama
export function calculateEmployerCost(payroll: Payroll): number {
  return payroll.grossAmount + payroll.sgkEmployerPremium + payroll.unemploymentEmployerPremium;
}

// Özet hesaplama (bir dönem için)
export function calculatePeriodSummary(payrolls: Payroll[], period: string) {
  const periodPayrolls = payrolls.filter(p => p.period === period);
  
  return {
    count: periodPayrolls.length,
    totalGross: periodPayrolls.reduce((sum, p) => sum + p.grossAmount, 0),
    totalNet: periodPayrolls.reduce((sum, p) => sum + p.netAmount, 0),
    totalSGKWorker: periodPayrolls.reduce((sum, p) => sum + p.sgkWorkerPremium, 0),
    totalSGKEmployer: periodPayrolls.reduce((sum, p) => sum + p.sgkEmployerPremium, 0),
    totalIncomeTax: periodPayrolls.reduce((sum, p) => sum + p.incomeTax, 0),
    totalStampTax: periodPayrolls.reduce((sum, p) => sum + p.stampTax, 0),
  };
}
