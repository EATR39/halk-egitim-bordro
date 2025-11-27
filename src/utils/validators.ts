// TC Kimlik No Doğrulama
export function validateTCNo(tcNo: string): { isValid: boolean; error?: string } {
  // Temizle
  const cleaned = tcNo.replace(/\D/g, '');
  
  // Uzunluk kontrolü
  if (cleaned.length !== 11) {
    return { isValid: false, error: 'TC Kimlik No 11 haneli olmalıdır' };
  }
  
  // İlk hane 0 olamaz
  if (cleaned[0] === '0') {
    return { isValid: false, error: 'TC Kimlik No 0 ile başlayamaz' };
  }
  
  // Sayı olmalı
  if (!/^\d{11}$/.test(cleaned)) {
    return { isValid: false, error: 'TC Kimlik No sadece rakamlardan oluşmalıdır' };
  }
  
  // Algoritma kontrolü
  const digits = cleaned.split('').map(Number);
  
  // 10. hane kontrolü
  const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = (sumOdd * 7 - sumEven) % 10;
  
  if (digit10 !== digits[9]) {
    return { isValid: false, error: 'Geçersiz TC Kimlik No' };
  }
  
  // 11. hane kontrolü
  const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const digit11 = sumFirst10 % 10;
  
  if (digit11 !== digits[10]) {
    return { isValid: false, error: 'Geçersiz TC Kimlik No' };
  }
  
  return { isValid: true };
}

// IBAN Doğrulama (Türkiye)
export function validateIBAN(iban: string): { isValid: boolean; error?: string } {
  // Temizle ve büyük harfe çevir
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  
  // Uzunluk kontrolü (Türkiye IBAN: 26 karakter)
  if (cleaned.length !== 26) {
    return { isValid: false, error: 'IBAN 26 karakter olmalıdır' };
  }
  
  // TR ile başlamalı
  if (!cleaned.startsWith('TR')) {
    return { isValid: false, error: 'IBAN TR ile başlamalıdır' };
  }
  
  // Format kontrolü
  if (!/^TR\d{24}$/.test(cleaned)) {
    return { isValid: false, error: 'Geçersiz IBAN formatı' };
  }
  
  // Mod 97 kontrolü
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numericIBAN = rearranged
    .split('')
    .map(char => {
      if (char >= '0' && char <= '9') {
        return char;
      }
      return String(char.charCodeAt(0) - 55);
    })
    .join('');
  
  // Büyük sayı mod 97 hesaplama
  let remainder = 0;
  for (let i = 0; i < numericIBAN.length; i++) {
    remainder = (remainder * 10 + parseInt(numericIBAN[i], 10)) % 97;
  }
  
  if (remainder !== 1) {
    return { isValid: false, error: 'Geçersiz IBAN' };
  }
  
  return { isValid: true };
}

// Saat ücreti doğrulama
export function validateHourlyRate(rate: string): { isValid: boolean; error?: string } {
  const num = parseFloat(rate);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Geçerli bir sayı giriniz' };
  }
  
  if (num <= 0) {
    return { isValid: false, error: 'Saat ücreti 0\'dan büyük olmalıdır' };
  }
  
  if (num > 10000) {
    return { isValid: false, error: 'Saat ücreti çok yüksek' };
  }
  
  return { isValid: true };
}

// Çalışma saati doğrulama
export function validateWorkHours(hours: string): { isValid: boolean; error?: string } {
  const num = parseFloat(hours);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Geçerli bir sayı giriniz' };
  }
  
  if (num < 0) {
    return { isValid: false, error: 'Çalışma saati negatif olamaz' };
  }
  
  if (num > 400) {
    return { isValid: false, error: 'Aylık çalışma saati çok yüksek' };
  }
  
  return { isValid: true };
}

// Çalışma günü doğrulama
export function validateWorkDays(days: string): { isValid: boolean; error?: string } {
  const num = parseInt(days, 10);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Geçerli bir sayı giriniz' };
  }
  
  if (num < 0) {
    return { isValid: false, error: 'Çalışma günü negatif olamaz' };
  }
  
  if (num > 31) {
    return { isValid: false, error: 'Çalışma günü 31\'den fazla olamaz' };
  }
  
  return { isValid: true };
}

// Ad/Soyad doğrulama
export function validateName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'En az 2 karakter olmalıdır' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: 'En fazla 50 karakter olabilir' };
  }
  
  // Sadece harf ve boşluk
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(trimmed)) {
    return { isValid: false, error: 'Sadece harf ve boşluk kullanılabilir' };
  }
  
  return { isValid: true };
}

// Dönem doğrulama
export function validatePeriod(period: string): { isValid: boolean; error?: string } {
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return { isValid: false, error: 'Geçersiz dönem formatı (YYYY-MM)' };
  }
  
  const [year, month] = period.split('-').map(Number);
  
  if (year < 2020 || year > 2030) {
    return { isValid: false, error: 'Geçersiz yıl' };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Geçersiz ay' };
  }
  
  return { isValid: true };
}
