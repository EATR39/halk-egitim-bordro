import type { Instructor, Payroll, SGKRates, StorageData } from '../types';
import { STORAGE_KEYS, DEFAULT_SGK_RATES } from '../utils/constants';

// UUID benzeri ID üreteci
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ==================== INSTRUCTORS ====================

export function getInstructors(): Instructor[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INSTRUCTORS);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Öğretici verileri okunamadı');
    return [];
  }
}

export function saveInstructors(instructors: Instructor[]): void {
  localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(instructors));
}

export function getInstructorById(id: string): Instructor | undefined {
  return getInstructors().find(i => i.id === id);
}

export function createInstructor(data: Omit<Instructor, 'id' | 'createdAt' | 'updatedAt'>): Instructor {
  const now = new Date().toISOString();
  const instructor: Instructor = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  const instructors = getInstructors();
  instructors.push(instructor);
  saveInstructors(instructors);
  
  return instructor;
}

export function updateInstructor(id: string, data: Partial<Instructor>): Instructor | null {
  const instructors = getInstructors();
  const index = instructors.findIndex(i => i.id === id);
  
  if (index === -1) return null;
  
  instructors[index] = {
    ...instructors[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  saveInstructors(instructors);
  return instructors[index];
}

export function deleteInstructor(id: string): boolean {
  const instructors = getInstructors();
  const filtered = instructors.filter(i => i.id !== id);
  
  if (filtered.length === instructors.length) return false;
  
  saveInstructors(filtered);
  return true;
}

// ==================== PAYROLLS ====================

export function getPayrolls(): Payroll[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAYROLLS);
    return data ? JSON.parse(data) : [];
  } catch {
    console.error('Bordro verileri okunamadı');
    return [];
  }
}

export function savePayrolls(payrolls: Payroll[]): void {
  localStorage.setItem(STORAGE_KEYS.PAYROLLS, JSON.stringify(payrolls));
}

export function getPayrollById(id: string): Payroll | undefined {
  return getPayrolls().find(p => p.id === id);
}

export function createPayroll(data: Omit<Payroll, 'id' | 'createdAt'>): Payroll {
  const payroll: Payroll = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  const payrolls = getPayrolls();
  payrolls.push(payroll);
  savePayrolls(payrolls);
  
  return payroll;
}

export function deletePayroll(id: string): boolean {
  const payrolls = getPayrolls();
  const filtered = payrolls.filter(p => p.id !== id);
  
  if (filtered.length === payrolls.length) return false;
  
  savePayrolls(filtered);
  return true;
}

export function getPayrollsByInstructor(instructorId: string): Payroll[] {
  return getPayrolls().filter(p => p.instructorId === instructorId);
}

export function getPayrollsByPeriod(period: string): Payroll[] {
  return getPayrolls().filter(p => p.period === period);
}

// ==================== SGK RATES ====================

export function getSGKRates(): SGKRates {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SGK_RATES);
    return data ? JSON.parse(data) : DEFAULT_SGK_RATES;
  } catch {
    console.error('SGK oranları okunamadı');
    return DEFAULT_SGK_RATES;
  }
}

export function saveSGKRates(rates: SGKRates): void {
  localStorage.setItem(STORAGE_KEYS.SGK_RATES, JSON.stringify(rates));
}

export function resetSGKRates(): SGKRates {
  localStorage.setItem(STORAGE_KEYS.SGK_RATES, JSON.stringify(DEFAULT_SGK_RATES));
  return DEFAULT_SGK_RATES;
}

// ==================== EXPORT / IMPORT ====================

export function exportData(): StorageData {
  return {
    instructors: getInstructors(),
    payrolls: getPayrolls(),
    sgkRates: getSGKRates(),
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
  };
}

export function importData(data: StorageData): boolean {
  try {
    if (!data.instructors || !data.payrolls) {
      throw new Error('Geçersiz veri formatı');
    }
    
    saveInstructors(data.instructors);
    savePayrolls(data.payrolls);
    
    if (data.sgkRates) {
      saveSGKRates(data.sgkRates);
    }
    
    return true;
  } catch (error) {
    console.error('Veri aktarımı başarısız:', error);
    return false;
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.INSTRUCTORS);
  localStorage.removeItem(STORAGE_KEYS.PAYROLLS);
  localStorage.removeItem(STORAGE_KEYS.SGK_RATES);
}

// ==================== DASHBOARD STATS ====================

export function getDashboardStats() {
  const instructors = getInstructors();
  const payrolls = getPayrolls();
  
  const currentDate = new Date();
  const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthPayrolls = payrolls.filter(p => p.period === currentPeriod);
  
  return {
    totalInstructors: instructors.length,
    activeInstructors: instructors.filter(i => !i.isRetired).length,
    retiredInstructors: instructors.filter(i => i.isRetired).length,
    totalPayrolls: payrolls.length,
    currentMonthPayrolls: currentMonthPayrolls.length,
    totalGrossThisMonth: currentMonthPayrolls.reduce((sum, p) => sum + p.grossAmount, 0),
    totalNetThisMonth: currentMonthPayrolls.reduce((sum, p) => sum + p.netAmount, 0),
  };
}
