import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Select } from '../components';
import { MEB_2025_HOURLY_RATES, MONTHS } from '../constants';
import type { Payroll, Instructor } from '../types';
import { calculatePayroll, formatCurrency } from '../utils';

// Demo eğitmenler
const DEMO_INSTRUCTORS: Instructor[] = [
  { id: '1', name: 'Ahmet Yılmaz', tcNo: '12345678901', department: 'Bilgisayar' },
  { id: '2', name: 'Fatma Demir', tcNo: '12345678902', department: 'İngilizce' },
  { id: '3', name: 'Mehmet Öztürk', tcNo: '12345678903', department: 'Matematik' },
];

// Helper function to get initial payrolls from localStorage
function getInitialPayrolls(): Payroll[] {
  const saved = localStorage.getItem('payrolls');
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

export function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>(getInitialPayrolls);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    instructorId: '',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    workingHours: '',
    workType: 'daytime' as 'daytime' | 'nighttime',
    useAutoRate: true,
    hourlyRate: MEB_2025_HOURLY_RATES.daytime.toString(),
    institution: 'Halk Eğitim Merkezi',
    department: 'Çorlu Lisesi',
  });

  // Bordroları localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('payrolls', JSON.stringify(payrolls));
  }, [payrolls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.instructorId) {
      alert('Lütfen bir eğitmen seçin');
      return;
    }

    if (!formData.workingHours || parseFloat(formData.workingHours) <= 0) {
      alert('Lütfen geçerli bir çalışma saati girin');
      return;
    }

    const workingHours = parseFloat(formData.workingHours);
    const calculatedDays = workingHours / 8;
    const hourlyRate = formData.useAutoRate
      ? (formData.workType === 'daytime' ? MEB_2025_HOURLY_RATES.daytime : MEB_2025_HOURLY_RATES.nighttime)
      : parseFloat(formData.hourlyRate);

    if (!formData.useAutoRate && (isNaN(hourlyRate) || hourlyRate <= 0)) {
      alert('Lütfen geçerli bir saat ücreti girin');
      return;
    }

    const calculations = calculatePayroll(workingHours, hourlyRate);

    const newPayroll: Payroll = {
      id: Date.now().toString(),
      instructorId: formData.instructorId,
      month: formData.month,
      year: formData.year,
      workingHours: workingHours,
      workType: formData.workType,
      calculatedDays: calculatedDays,
      premiumDays: calculatedDays,
      hourlyRate: hourlyRate,
      institution: formData.institution,
      department: formData.department,
      calculations,
      createdAt: new Date().toISOString(),
    };

    setPayrolls([...payrolls, newPayroll]);
    setShowForm(false);
    setFormData({
      instructorId: '',
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      workingHours: '',
      workType: 'daytime',
      useAutoRate: true,
      hourlyRate: MEB_2025_HOURLY_RATES.daytime.toString(),
      institution: 'Halk Eğitim Merkezi',
      department: 'Çorlu Lisesi',
    });
  };

  const getInstructorName = (id: string) => {
    const instructor = DEMO_INSTRUCTORS.find(i => i.id === id);
    return instructor?.name || 'Bilinmiyor';
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu bordroyu silmek istediğinizden emin misiniz?')) {
      setPayrolls(payrolls.filter(p => p.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bordrolar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'İptal' : '+ Yeni Bordro'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Yeni Bordro Oluştur</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eğitmen Seçimi */}
              <Select
                label="Eğitmen"
                required
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                options={[
                  { value: '', label: 'Eğitmen Seçin' },
                  ...DEMO_INSTRUCTORS.map(i => ({ value: i.id, label: i.name }))
                ]}
              />

              {/* Ay Seçimi */}
              <Select
                label="Ay"
                required
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                options={MONTHS.map((month, index) => ({ value: index, label: month }))}
              />

              {/* Yıl */}
              <Input
                label="Yıl"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />

              {/* Kurum */}
              <Input
                label="Kurum"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
              />
            </div>

            {/* Çalışma Türü Seçimi */}
            <div className="mb-4 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çalışma Türü <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="workType"
                    value="daytime"
                    checked={formData.workType === 'daytime'}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        workType: 'daytime',
                        hourlyRate: formData.useAutoRate ? MEB_2025_HOURLY_RATES.daytime.toString() : formData.hourlyRate
                      });
                    }}
                    className="mr-2"
                  />
                  <span>🌞 Gündüz (163,83 TL/saat)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="workType"
                    value="nighttime"
                    checked={formData.workType === 'nighttime'}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        workType: 'nighttime',
                        hourlyRate: formData.useAutoRate ? MEB_2025_HOURLY_RATES.nighttime.toString() : formData.hourlyRate
                      });
                    }}
                    className="mr-2"
                  />
                  <span>🌙 Gece (191,25 TL/saat)</span>
                </label>
              </div>
            </div>

            {/* Çalışma Saati */}
            <Input
              label="Toplam Çalışma Saati"
              type="number"
              step="0.01"
              value={formData.workingHours}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  workingHours: e.target.value
                });
              }}
              required
              placeholder="160"
            />

            {/* Otomatik Hesaplanan Gün Gösterimi */}
            {formData.workingHours && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  📊 Otomatik Hesaplama:
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {(parseFloat(formData.workingHours) / 8).toFixed(2)} gün
                  <span className="text-sm font-normal ml-2">(8 saat = 1 gün)</span>
                </p>
              </div>
            )}

            {/* Saat Ücreti */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saat Ücreti
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rateType"
                    checked={formData.useAutoRate}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        useAutoRate: true,
                        hourlyRate: formData.workType === 'daytime'
                          ? MEB_2025_HOURLY_RATES.daytime.toString()
                          : MEB_2025_HOURLY_RATES.nighttime.toString()
                      });
                    }}
                    className="mr-2"
                  />
                  <span>
                    🏛️ MEB 2025 Ek Ders Ücreti (Otomatik: {
                      formData.workType === 'daytime'
                        ? '163,83'
                        : '191,25'
                    } TL)
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="rateType"
                    checked={!formData.useAutoRate}
                    onChange={() => setFormData({ ...formData, useAutoRate: false })}
                    className="mr-2"
                  />
                  <span>✏️ Manuel Giriş</span>
                </label>
              </div>

              {!formData.useAutoRate && (
                <Input
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="Manuel ücret girin"
                  className="mt-2"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Bordro Oluştur
            </button>
          </form>
        </div>
      )}

      {/* Bordro Listesi */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eğitmen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dönem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışma Türü</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saat / Gün</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Ücret</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Henüz bordro bulunmuyor
                </td>
              </tr>
            ) : (
              payrolls.map((payroll) => (
                <tr key={payroll.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{getInstructorName(payroll.instructorId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{MONTHS[payroll.month]} {payroll.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payroll.workType === 'daytime' ? '🌞 Gündüz' : '🌙 Gece'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payroll.workingHours} saat / {payroll.calculatedDays.toFixed(2)} gün
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                    {formatCurrency(payroll.calculations.netIncome)} TL
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/payrolls/${payroll.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Detay
                    </Link>
                    <button
                      onClick={() => handleDelete(payroll.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
