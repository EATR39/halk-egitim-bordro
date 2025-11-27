import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import type { Instructor, InstructorFormData } from '../types';
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from '../services/storage.service';
import { validateTCNo, validateIBAN, validateName, validateHourlyRate } from '../utils/validators';
import { formatTCNo, formatIBAN, formatCurrency } from '../utils/formatters';
import { DEFAULT_HOURLY_RATE } from '../utils/constants';

const initialFormData: InstructorFormData = {
  tcNo: '',
  firstName: '',
  lastName: '',
  iban: '',
  isRetired: false,
  hourlyRate: String(DEFAULT_HOURLY_RATE),
};

export function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<InstructorFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<InstructorFormData>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = () => {
    setInstructors(getInstructors());
  };

  const filteredInstructors = instructors.filter((i) => {
    const term = searchTerm.toLowerCase();
    return (
      i.firstName.toLowerCase().includes(term) ||
      i.lastName.toLowerCase().includes(term) ||
      i.tcNo.includes(term)
    );
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<InstructorFormData> = {};

    const tcResult = validateTCNo(formData.tcNo);
    if (!tcResult.isValid) newErrors.tcNo = tcResult.error;

    const firstNameResult = validateName(formData.firstName);
    if (!firstNameResult.isValid) newErrors.firstName = firstNameResult.error;

    const lastNameResult = validateName(formData.lastName);
    if (!lastNameResult.isValid) newErrors.lastName = lastNameResult.error;

    const ibanResult = validateIBAN(formData.iban);
    if (!ibanResult.isValid) newErrors.iban = ibanResult.error;

    const hourlyRateResult = validateHourlyRate(formData.hourlyRate);
    if (!hourlyRateResult.isValid) newErrors.hourlyRate = hourlyRateResult.error;

    // TC No benzersiz mi kontrol et
    const existingTC = instructors.find(
      (i) => i.tcNo === formData.tcNo.replace(/\D/g, '') && i.id !== editingId
    );
    if (existingTC) {
      newErrors.tcNo = 'Bu TC Kimlik No zaten kayıtlı';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const instructorData = {
      tcNo: formData.tcNo.replace(/\D/g, ''),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      iban: formData.iban.replace(/\s/g, '').toUpperCase(),
      isRetired: formData.isRetired,
      hourlyRate: parseFloat(formData.hourlyRate),
    };

    if (editingId) {
      updateInstructor(editingId, instructorData);
    } else {
      createInstructor(instructorData);
    }

    loadInstructors();
    resetForm();
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingId(instructor.id);
    setFormData({
      tcNo: instructor.tcNo,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      iban: instructor.iban,
      isRetired: instructor.isRetired,
      hourlyRate: String(instructor.hourlyRate),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu usta öğreticiyi silmek istediğinizden emin misiniz?')) {
      deleteInstructor(id);
      loadInstructors();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Usta Öğreticiler</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Yeni Usta Öğretici
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card title={editingId ? 'Usta Öğretici Düzenle' : 'Yeni Usta Öğretici'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="TC Kimlik No"
                value={formData.tcNo}
                onChange={(e) =>
                  setFormData({ ...formData, tcNo: e.target.value })
                }
                error={errors.tcNo}
                placeholder="11111111111"
                maxLength={11}
              />
              <Input
                label="Saat Ücreti (₺)"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                error={errors.hourlyRate}
                min="0"
                step="0.01"
              />
              <Input
                label="Ad"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                error={errors.firstName}
                placeholder="Ahmet"
              />
              <Input
                label="Soyad"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                error={errors.lastName}
                placeholder="Yılmaz"
              />
              <div className="md:col-span-2">
                <Input
                  label="IBAN"
                  value={formData.iban}
                  onChange={(e) =>
                    setFormData({ ...formData, iban: e.target.value })
                  }
                  error={errors.iban}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRetired}
                    onChange={(e) =>
                      setFormData({ ...formData, isRetired: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Emekli</span>
                  <span className="text-sm text-gray-500">
                    (Emekliler için sadece iştirakçi payı kesilir)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="success">
                {editingId ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                İptal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Ad, soyad veya TC ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Instructor List */}
      <Card>
        {filteredInstructors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchTerm
              ? 'Arama kriterlerine uygun öğretici bulunamadı.'
              : 'Henüz usta öğretici eklenmemiş.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">TC Kimlik No</th>
                  <th className="text-left p-3 font-semibold">Ad Soyad</th>
                  <th className="text-left p-3 font-semibold">IBAN</th>
                  <th className="text-center p-3 font-semibold">Saat Ücreti</th>
                  <th className="text-center p-3 font-semibold">Durum</th>
                  <th className="text-center p-3 font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono">
                      {formatTCNo(instructor.tcNo)}
                    </td>
                    <td className="p-3">
                      {instructor.firstName} {instructor.lastName}
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {formatIBAN(instructor.iban)}
                    </td>
                    <td className="p-3 text-center">
                      {formatCurrency(instructor.hourlyRate)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          instructor.isRetired
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {instructor.isRetired ? 'Emekli' : 'İşsiz'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(instructor)}
                        >
                          Düzenle
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(instructor.id)}
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
    </div>
  );
}
