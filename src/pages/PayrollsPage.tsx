import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import type { Instructor, Payroll, PayrollFormData } from '../types';
import {
  getInstructors,
  getPayrolls,
  createPayroll,
  deletePayroll,
  getSGKRates,
} from '../services/storage.service';
import { calculatePayroll, getCumulativeGross } from '../utils/calculations';
import { formatCurrency, formatPeriod } from '../utils/formatters';
import { validateWorkHours, validateWorkDays, validatePeriod } from '../utils/validators';
import { getCurrentPeriod, MONTHS_TR, getYearOptions } from '../utils/constants';

const initialFormData: PayrollFormData = {
  instructorId: '',
  period: getCurrentPeriod(),
  workDays: '15',
  workHours: '60',
};

export function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PayrollFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<PayrollFormData>>({});
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPayrolls(getPayrolls());
    setInstructors(getInstructors());
  };

  const filteredPayrolls = payrolls.filter((p) => {
    if (filterPeriod) {
      return p.period === filterPeriod;
    }
    if (filterYear && filterMonth) {
      return p.period === `${filterYear}-${filterMonth}`;
    }
    if (filterYear) {
      return p.period.startsWith(filterYear);
    }
    return true;
  }).sort((a, b) => {
    // Önce döneme, sonra isme göre sırala
    if (a.period !== b.period) {
      return b.period.localeCompare(a.period);
    }
    return a.instructorName.localeCompare(b.instructorName);
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<PayrollFormData> = {};

    if (!formData.instructorId) {
      newErrors.instructorId = 'Lütfen bir usta öğretici seçin';
    }

    const periodResult = validatePeriod(formData.period);
    if (!periodResult.isValid) {
      newErrors.period = periodResult.error;
    }

    const hoursResult = validateWorkHours(formData.workHours);
    if (!hoursResult.isValid) {
      newErrors.workHours = hoursResult.error;
    }

    const daysResult = validateWorkDays(formData.workDays);
    if (!daysResult.isValid) {
      newErrors.workDays = daysResult.error;
    }

    // Aynı dönemde aynı öğretici için bordro var mı kontrol et
    const existingPayroll = payrolls.find(
      (p) => p.instructorId === formData.instructorId && p.period === formData.period
    );
    if (existingPayroll) {
      newErrors.instructorId = 'Bu dönemde bu öğretici için zaten bordro var';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const instructor = instructors.find((i) => i.id === formData.instructorId);
    if (!instructor) return;

    const workHours = parseFloat(formData.workHours);
    const workDays = parseInt(formData.workDays, 10);
    const [year] = formData.period.split('-');
    const rates = getSGKRates();

    // Önceki kümülatif brüt
    const previousCumulativeGross = getCumulativeGross(
      payrolls,
      instructor.id,
      parseInt(year, 10),
      formData.period
    );

    // Bordro hesapla
    const calculation = calculatePayroll(
      instructor,
      workHours,
      workDays,
      previousCumulativeGross,
      rates
    );

    // Bordro oluştur
    createPayroll({
      instructorId: instructor.id,
      instructorName: `${instructor.firstName} ${instructor.lastName}`,
      period: formData.period,
      workDays,
      workHours,
      hourlyRate: instructor.hourlyRate,
      isRetired: instructor.isRetired,
      cumulativeGross: previousCumulativeGross + (calculation.grossAmount - calculation.sgkWorkerPremium - calculation.unemploymentWorkerPremium),
      ...calculation,
    });

    loadData();
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu bordroyu silmek istediğinizden emin misiniz?')) {
      deletePayroll(id);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setShowForm(false);
  };

  const instructorOptions = instructors.map((i) => ({
    value: i.id,
    label: `${i.firstName} ${i.lastName} ${i.isRetired ? '(Emekli)' : '(İşsiz)'}`,
  }));

  const yearOptions = getYearOptions().map((y) => ({
    value: String(y),
    label: String(y),
  }));

  const monthOptions = MONTHS_TR.map((m, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: m,
  }));

  // Form için dönem seçici
  const [formYear, setFormYear] = useState(String(new Date().getFullYear()));
  const [formMonth, setFormMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      period: `${formYear}-${formMonth}`,
    }));
  }, [formYear, formMonth]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bordrolar</h2>
        {!showForm && instructors.length > 0 && (
          <Button onClick={() => setShowForm(true)}>+ Yeni Bordro</Button>
        )}
      </div>

      {instructors.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              Bordro oluşturmak için önce usta öğretici eklemelisiniz.
            </p>
            <Link to="/instructors">
              <Button>Usta Öğretici Ekle</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card title="Yeni Bordro Oluştur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Usta Öğretici"
                options={instructorOptions}
                value={formData.instructorId}
                onChange={(e) =>
                  setFormData({ ...formData, instructorId: e.target.value })
                }
                error={errors.instructorId}
                placeholder="Seçiniz..."
              />
              <Select
                label="Yıl"
                options={yearOptions}
                value={formYear}
                onChange={(e) => setFormYear(e.target.value)}
              />
              <Select
                label="Ay"
                options={monthOptions}
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
              />
              <Input
                label="Çalışma Günü"
                type="number"
                value={formData.workDays}
                onChange={(e) =>
                  setFormData({ ...formData, workDays: e.target.value })
                }
                error={errors.workDays}
                min="0"
                max="31"
              />
              <Input
                label="Çalışma Saati"
                type="number"
                value={formData.workHours}
                onChange={(e) =>
                  setFormData({ ...formData, workHours: e.target.value })
                }
                error={errors.workHours}
                min="0"
                step="0.5"
              />
            </div>

            {formData.instructorId && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Seçili Öğretici:</strong>{' '}
                  {instructors.find((i) => i.id === formData.instructorId)?.firstName}{' '}
                  {instructors.find((i) => i.id === formData.instructorId)?.lastName}
                  {' | '}
                  <strong>Saat Ücreti:</strong>{' '}
                  {formatCurrency(
                    instructors.find((i) => i.id === formData.instructorId)?.hourlyRate || 0
                  )}
                  {' | '}
                  <strong>Tahmini Brüt:</strong>{' '}
                  {formatCurrency(
                    (instructors.find((i) => i.id === formData.instructorId)?.hourlyRate || 0) *
                      parseFloat(formData.workHours || '0')
                  )}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="success">
                Hesapla ve Kaydet
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                İptal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-4">
        <Select
          options={yearOptions}
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          placeholder="Tüm Yıllar"
          className="w-32"
        />
        <Select
          options={monthOptions}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          placeholder="Tüm Aylar"
          className="w-40"
        />
        {(filterYear || filterMonth) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFilterYear('');
              setFilterMonth('');
              setFilterPeriod('');
            }}
          >
            Filtreyi Temizle
          </Button>
        )}
      </div>

      {/* Payroll List */}
      <Card>
        {filteredPayrolls.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {payrolls.length === 0
              ? 'Henüz bordro oluşturulmamış.'
              : 'Filtreye uygun bordro bulunamadı.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Dönem</th>
                  <th className="text-left p-3 font-semibold">Ad Soyad</th>
                  <th className="text-center p-3 font-semibold">Saat</th>
                  <th className="text-right p-3 font-semibold">Brüt</th>
                  <th className="text-right p-3 font-semibold">Kesintiler</th>
                  <th className="text-right p-3 font-semibold">Net</th>
                  <th className="text-center p-3 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.map((payroll) => (
                  <tr key={payroll.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{formatPeriod(payroll.period)}</td>
                    <td className="p-3">
                      <span>{payroll.instructorName}</span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          payroll.isRetired
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {payroll.isRetired ? 'E' : 'İ'}
                      </span>
                    </td>
                    <td className="p-3 text-center">{payroll.workHours}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(payroll.grossAmount)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      -{formatCurrency(payroll.totalDeductions)}
                    </td>
                    <td className="p-3 text-right font-semibold text-green-600">
                      {formatCurrency(payroll.netAmount)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Link to={`/payrolls/${payroll.id}`}>
                          <Button size="sm" variant="outline">
                            Detay
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(payroll.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Summary */}
      {filteredPayrolls.length > 0 && (
        <Card title="Özet">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {filteredPayrolls.length}
              </p>
              <p className="text-sm text-gray-500">Bordro Sayısı</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  filteredPayrolls.reduce((sum, p) => sum + p.grossAmount, 0)
                )}
              </p>
              <p className="text-sm text-gray-500">Toplam Brüt</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  filteredPayrolls.reduce((sum, p) => sum + p.totalDeductions, 0)
                )}
              </p>
              <p className="text-sm text-gray-500">Toplam Kesinti</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  filteredPayrolls.reduce((sum, p) => sum + p.netAmount, 0)
                )}
              </p>
              <p className="text-sm text-gray-500">Toplam Net</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
