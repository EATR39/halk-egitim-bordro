import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import type { Payroll, Instructor } from '../types';
import { getPayrollById, getInstructorById, deletePayroll } from '../services/storage.service';
import { formatCurrency, formatPeriod, formatTCNo, formatIBAN, formatDate } from '../utils/formatters';
import { calculateEmployerCost } from '../utils/calculations';

export function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    if (id) {
      const p = getPayrollById(id);
      if (p) {
        setPayroll(p);
        const i = getInstructorById(p.instructorId);
        if (i) setInstructor(i);
      }
    }
  }, [id]);

  const handleDelete = () => {
    if (payroll && window.confirm('Bu bordroyu silmek istediğinizden emin misiniz?')) {
      deletePayroll(payroll.id);
      navigate('/payrolls');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!payroll) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Bordro bulunamadı.</p>
          <Link to="/payrolls">
            <Button>Bordrolara Dön</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const employerCost = calculateEmployerCost(payroll);

  return (
    <div className="space-y-6">
      {/* Header - print:hidden */}
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-4">
          <Link to="/payrolls">
            <Button variant="secondary">← Geri</Button>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Bordro Detayı</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            🖨️ Yazdır
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Sil
          </Button>
        </div>
      </div>

      {/* Printable Content */}
      <div className="print:m-0">
        {/* Print Header */}
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-2xl font-bold">HALK EĞİTİM MERKEZİ</h1>
          <h2 className="text-xl">USTA ÖĞRETİCİ BORDROSU</h2>
          <p className="text-lg mt-2">{formatPeriod(payroll.period)}</p>
        </div>

        {/* Instructor Info */}
        <Card title="Usta Öğretici Bilgileri" className="print:shadow-none print:border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ad Soyad</p>
              <p className="font-semibold">{payroll.instructorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">TC Kimlik No</p>
              <p className="font-mono">{instructor ? formatTCNo(instructor.tcNo) : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IBAN</p>
              <p className="font-mono text-sm">{instructor ? formatIBAN(instructor.iban) : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durum</p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  payroll.isRetired
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {payroll.isRetired ? 'Emekli' : 'İşsiz'}
              </span>
            </div>
          </div>
        </Card>

        {/* Work Info */}
        <Card title="Çalışma Bilgileri" className="print:shadow-none print:border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Dönem</p>
              <p className="font-semibold">{formatPeriod(payroll.period)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Çalışma Günü</p>
              <p className="font-semibold">{payroll.workDays} gün</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Çalışma Saati</p>
              <p className="font-semibold">{payroll.workHours} saat</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saat Ücreti</p>
              <p className="font-semibold">{formatCurrency(payroll.hourlyRate)}</p>
            </div>
          </div>
        </Card>

        {/* Calculation Details */}
        <Card title="Ücret Hesabı" className="print:shadow-none print:border">
          <div className="space-y-4">
            {/* Brüt */}
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Brüt Ücret</span>
              <span className="font-semibold text-lg">
                {formatCurrency(payroll.grossAmount)}
              </span>
            </div>

            {/* SGK Kesintileri */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">SGK Kesintileri (İşçi Payı)</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>SGK Primi (%14)</span>
                  <span className="text-red-600">-{formatCurrency(payroll.sgkWorkerPremium)}</span>
                </div>
                <div className="flex justify-between">
                  <span>İşsizlik Primi (%1)</span>
                  <span className="text-red-600">-{formatCurrency(payroll.unemploymentWorkerPremium)}</span>
                </div>
              </div>
            </div>

            {/* Vergi Kesintileri */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-700 mb-2">Vergi Kesintileri</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Gelir Vergisi (Artan Oranlı)</span>
                  <span className="text-red-600">-{formatCurrency(payroll.incomeTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Damga Vergisi (%0.759)</span>
                  <span className="text-red-600">-{formatCurrency(payroll.stampTax)}</span>
                </div>
              </div>
            </div>

            {/* Toplam Kesinti */}
            <div className="flex justify-between items-center py-2 border-t">
              <span className="text-gray-600">Toplam Kesinti</span>
              <span className="font-semibold text-red-600">
                -{formatCurrency(payroll.totalDeductions)}
              </span>
            </div>

            {/* Net */}
            <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4">
              <span className="font-semibold text-gray-900">NET ÖDEME</span>
              <span className="font-bold text-2xl text-green-600">
                {formatCurrency(payroll.netAmount)}
              </span>
            </div>
          </div>
        </Card>

        {/* Employer Cost */}
        <Card title="İşveren Maliyeti" className="print:shadow-none print:border">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1">
              <span>Brüt Ücret</span>
              <span>{formatCurrency(payroll.grossAmount)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>SGK İşveren Payı</span>
              <span>+{formatCurrency(payroll.sgkEmployerPremium)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>İşsizlik İşveren Payı</span>
              <span>+{formatCurrency(payroll.unemploymentEmployerPremium)}</span>
            </div>
            <div className="flex justify-between py-2 border-t font-semibold">
              <span>Toplam İşveren Maliyeti</span>
              <span className="text-blue-600">{formatCurrency(employerCost)}</span>
            </div>
          </div>
        </Card>

        {/* Meta Info */}
        <div className="text-sm text-gray-500 print:mt-8">
          <p>Oluşturulma Tarihi: {formatDate(payroll.createdAt)}</p>
          <p>Kümülatif Vergi Matrahı: {formatCurrency(payroll.cumulativeGross)}</p>
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-12">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-black pt-2 mx-8">
                <p>Hazırlayan</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2 mx-8">
                <p>Onaylayan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
