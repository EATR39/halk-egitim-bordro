/**
 * Para formatı (Türk Lirası)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Saatten güne dönüştürme (8 saat = 1 gün)
 */
export function hoursTodays(hours: number): number {
  return hours / 8;
}

/**
 * Bordro hesaplamaları
 */
export function calculatePayroll(workingHours: number, hourlyRate: number) {
  const grossIncome = workingHours * hourlyRate;
  const stampTax = grossIncome * 0.00759; // %0.759 Damga Vergisi
  const incomeTax = grossIncome * 0.15; // %15 Gelir Vergisi
  const netIncome = grossIncome - stampTax - incomeTax;

  return {
    grossIncome,
    stampTax,
    incomeTax,
    netIncome,
  };
}
