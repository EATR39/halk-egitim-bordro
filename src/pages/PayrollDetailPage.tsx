import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Payroll, Instructor } from '../types';
import { formatCurrency } from '../utils';
import { MONTHS } from '../constants';

// Demo eğitmenler
const DEMO_INSTRUCTORS: Instructor[] = [
  { id: '1', name: 'Ahmet Yılmaz', tcNo: '12345678901', department: 'Bilgisayar' },
  { id: '2', name: 'Fatma Demir', tcNo: '12345678902', department: 'İngilizce' },
  { id: '3', name: 'Mehmet Öztürk', tcNo: '12345678903', department: 'Matematik' },
];

export function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>();

  const payroll = useMemo(() => {
    const saved = localStorage.getItem('payrolls');
    if (saved) {
      const payrolls: Payroll[] = JSON.parse(saved);
      return payrolls.find(p => p.id === id) || null;
    }
    return null;
  }, [id]);

  if (!payroll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-500 mb-4">Bordro bulunamadı</p>
          <Link to="/payrolls" className="text-blue-600 hover:text-blue-800">
            Bordrolara Dön
          </Link>
        </div>
      </div>
    );
  }

  const instructor = DEMO_INSTRUCTORS.find(i => i.id === payroll.instructorId);
  const calc = payroll.calculations;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/payrolls" className="text-blue-600 hover:text-blue-800">
          ← Bordrolara Dön
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{payroll.institution}</h1>
          <p className="text-gray-600">{payroll.department}</p>
          <p className="text-lg font-semibold mt-2">
            {MONTHS[payroll.month]} {payroll.year} Bordrosu
          </p>
        </div>

        {/* Personel Bilgileri */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Personel Bilgileri
          </h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold w-1/2">Adı Soyadı</td>
                <td className="py-2 text-right">{instructor?.name || 'Bilinmiyor'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">T.C. Kimlik No</td>
                <td className="py-2 text-right">{instructor?.tcNo || '-'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Branş</td>
                <td className="py-2 text-right">{instructor?.department || '-'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Çalışma Türü</td>
                <td className="py-2 text-right">
                  {payroll.workType === 'daytime' ? '🌞 Gündüz' : '🌙 Gece'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Aylık Toplam Saat</td>
                <td className="py-2 text-right">{payroll.workingHours} saat</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Toplam Gün</td>
                <td className="py-2 text-right">
                  {payroll.calculatedDays.toFixed(2)} gün
                  <span className="text-xs text-gray-600 ml-1">(8 saat = 1 gün)</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Saat Ücreti</td>
                <td className="py-2 text-right">{formatCurrency(payroll.hourlyRate)} TL</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Gün Ücreti</td>
                <td className="py-2 text-right">
                  {formatCurrency(payroll.hourlyRate * 8)} TL
                  <span className="text-xs text-gray-600 ml-1">(saat ücreti × 8)</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Prim Gün Sayısı</td>
                <td className="py-2 text-right">{payroll.premiumDays.toFixed(2)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Gündüz Saat / Tutar</td>
                <td className="py-2 text-right">
                  {payroll.workingHours} / {formatCurrency(calc.grossIncome)} TL
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hesaplamalar */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Ücret Hesaplamaları
          </h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Brüt Ücret</td>
                <td className="py-2 text-right">{formatCurrency(calc.grossIncome)} TL</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Damga Vergisi (%0,759)</td>
                <td className="py-2 text-right text-red-600">-{formatCurrency(calc.stampTax)} TL</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Gelir Vergisi (%15)</td>
                <td className="py-2 text-right text-red-600">-{formatCurrency(calc.incomeTax)} TL</td>
              </tr>
              <tr className="border-b bg-green-50">
                <td className="py-3 font-bold text-lg">Net Ödeme</td>
                <td className="py-3 text-right font-bold text-lg text-green-600">
                  {formatCurrency(calc.netIncome)} TL
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Yazdır Butonu */}
        <div className="flex justify-end">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🖨️ Yazdır
          </button>
        </div>
      </div>
    </div>
  );
}
