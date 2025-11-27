import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import type { SGKRates } from '../types';
import { getSGKRates, saveSGKRates, resetSGKRates } from '../services/storage.service';
import { DEFAULT_SGK_RATES, TAX_BRACKETS_2025 } from '../utils/constants';
import { formatPercent, formatCurrency } from '../utils/formatters';

export function SGKRatesPage() {
  const [rates, setRates] = useState<SGKRates>(DEFAULT_SGK_RATES);
  const [isEditing, setIsEditing] = useState(false);
  const [formRates, setFormRates] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = () => {
    const savedRates = getSGKRates();
    setRates(savedRates);
    setFormRates({
      sgkWorkerRate: String(savedRates.sgkWorkerRate * 100),
      sgkEmployerRate: String(savedRates.sgkEmployerRate * 100),
      participantRate: String(savedRates.participantRate * 100),
      unemploymentWorkerRate: String(savedRates.unemploymentWorkerRate * 100),
      unemploymentEmployerRate: String(savedRates.unemploymentEmployerRate * 100),
      stampTaxRate: String(savedRates.stampTaxRate * 100),
    });
  };

  const handleSave = () => {
    const newRates: SGKRates = {
      sgkWorkerRate: parseFloat(formRates.sgkWorkerRate) / 100,
      sgkEmployerRate: parseFloat(formRates.sgkEmployerRate) / 100,
      participantRate: parseFloat(formRates.participantRate) / 100,
      unemploymentWorkerRate: parseFloat(formRates.unemploymentWorkerRate) / 100,
      unemploymentEmployerRate: parseFloat(formRates.unemploymentEmployerRate) / 100,
      stampTaxRate: parseFloat(formRates.stampTaxRate) / 100,
    };

    saveSGKRates(newRates);
    setRates(newRates);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Varsayılan oranları geri yüklemek istediğinizden emin misiniz?')) {
      const defaultRates = resetSGKRates();
      setRates(defaultRates);
      setFormRates({
        sgkWorkerRate: String(defaultRates.sgkWorkerRate * 100),
        sgkEmployerRate: String(defaultRates.sgkEmployerRate * 100),
        participantRate: String(defaultRates.participantRate * 100),
        unemploymentWorkerRate: String(defaultRates.unemploymentWorkerRate * 100),
        unemploymentEmployerRate: String(defaultRates.unemploymentEmployerRate * 100),
        stampTaxRate: String(defaultRates.stampTaxRate * 100),
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">SGK Oranları</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Düzenle</Button>
          ) : (
            <>
              <Button onClick={handleSave} variant="success">
                Kaydet
              </Button>
              <Button
                onClick={() => {
                  loadRates();
                  setIsEditing(false);
                }}
                variant="secondary"
              >
                İptal
              </Button>
            </>
          )}
          <Button onClick={handleReset} variant="outline">
            Varsayılana Dön
          </Button>
        </div>
      </div>

      {/* SGK Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="İşsiz Usta Öğretici Oranları">
          <div className="space-y-4">
            {isEditing ? (
              <>
                <Input
                  label="SGK İşçi Payı (%)"
                  type="number"
                  value={formRates.sgkWorkerRate}
                  onChange={(e) =>
                    setFormRates({ ...formRates, sgkWorkerRate: e.target.value })
                  }
                  step="0.01"
                />
                <Input
                  label="SGK İşveren Payı (%)"
                  type="number"
                  value={formRates.sgkEmployerRate}
                  onChange={(e) =>
                    setFormRates({ ...formRates, sgkEmployerRate: e.target.value })
                  }
                  step="0.01"
                />
                <Input
                  label="İşsizlik İşçi Payı (%)"
                  type="number"
                  value={formRates.unemploymentWorkerRate}
                  onChange={(e) =>
                    setFormRates({ ...formRates, unemploymentWorkerRate: e.target.value })
                  }
                  step="0.01"
                />
                <Input
                  label="İşsizlik İşveren Payı (%)"
                  type="number"
                  value={formRates.unemploymentEmployerRate}
                  onChange={(e) =>
                    setFormRates({ ...formRates, unemploymentEmployerRate: e.target.value })
                  }
                  step="0.01"
                />
              </>
            ) : (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">SGK İşçi Payı</span>
                  <span className="font-semibold">{formatPercent(rates.sgkWorkerRate)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">SGK İşveren Payı</span>
                  <span className="font-semibold">{formatPercent(rates.sgkEmployerRate)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">İşsizlik İşçi Payı</span>
                  <span className="font-semibold">{formatPercent(rates.unemploymentWorkerRate)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">İşsizlik İşveren Payı</span>
                  <span className="font-semibold">{formatPercent(rates.unemploymentEmployerRate)}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card title="Emekli Usta Öğretici Oranları">
          <div className="space-y-4">
            {isEditing ? (
              <Input
                label="İştirakçi (SGDP) Payı (%)"
                type="number"
                value={formRates.participantRate}
                onChange={(e) =>
                  setFormRates({ ...formRates, participantRate: e.target.value })
                }
                step="0.01"
              />
            ) : (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">İştirakçi (SGDP) Payı</span>
                <span className="font-semibold">{formatPercent(rates.participantRate)}</span>
              </div>
            )}
            <div className="bg-orange-50 p-4 rounded-lg text-sm text-orange-700">
              <p className="font-semibold mb-1">Not:</p>
              <p>Emekli usta öğreticilerden SGK işçi payı ve işsizlik primi kesilmez.</p>
              <p>Sadece işveren tarafından iştirakçi (SGDP) payı ödenir.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stamp Tax */}
      <Card title="Damga Vergisi">
        <div className="space-y-4">
          {isEditing ? (
            <Input
              label="Damga Vergisi Oranı (%)"
              type="number"
              value={formRates.stampTaxRate}
              onChange={(e) =>
                setFormRates({ ...formRates, stampTaxRate: e.target.value })
              }
              step="0.001"
            />
          ) : (
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Damga Vergisi</span>
              <span className="font-semibold">{formatPercent(rates.stampTaxRate)}</span>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Damga vergisi brüt ücret üzerinden hesaplanır.
          </p>
        </div>
      </Card>

      {/* Tax Brackets */}
      <Card title="2025 Gelir Vergisi Dilimleri">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">Dilim</th>
                <th className="text-right p-3">Alt Limit</th>
                <th className="text-right p-3">Üst Limit</th>
                <th className="text-center p-3">Oran</th>
              </tr>
            </thead>
            <tbody>
              {TAX_BRACKETS_2025.map((bracket, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 font-medium">{index + 1}. Dilim</td>
                  <td className="p-3 text-right">{formatCurrency(bracket.min)}</td>
                  <td className="p-3 text-right">
                    {bracket.max === Infinity ? '∞' : formatCurrency(bracket.max)}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {formatPercent(bracket.rate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-semibold mb-1">Artan Oranlı Vergi Hesaplama:</p>
          <p>
            Gelir vergisi, yıllık kümülatif vergi matrahına göre artan oranlı hesaplanır.
            Her dönemde önceki dönemlerin vergi matrahları toplanarak hangi dilimde olunduğu
            belirlenir ve o dilimin oranı uygulanır.
          </p>
        </div>
      </Card>
    </div>
  );
}
