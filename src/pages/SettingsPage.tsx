import { useState, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { exportData, importData, clearAllData, getDashboardStats } from '../services/storage.service';
import { formatDateTime } from '../utils/formatters';
import type { StorageData } from '../types';

export function SettingsPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bordro-yedek-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('success', 'Veriler başarıyla dışa aktarıldı.');
    } catch {
      showMessage('error', 'Dışa aktarma sırasında bir hata oluştu.');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as StorageData;
        
        if (!data.instructors || !data.payrolls) {
          throw new Error('Geçersiz dosya formatı');
        }

        if (
          window.confirm(
            `Bu işlem mevcut verilerin üzerine yazacaktır.\n\n` +
            `İçe aktarılacak:\n` +
            `- ${data.instructors.length} usta öğretici\n` +
            `- ${data.payrolls.length} bordro\n\n` +
            `Devam etmek istiyor musunuz?`
          )
        ) {
          const success = importData(data);
          if (success) {
            showMessage('success', 'Veriler başarıyla içe aktarıldı.');
            window.location.reload();
          } else {
            showMessage('error', 'Veri aktarımı başarısız oldu.');
          }
        }
      } catch {
        showMessage('error', 'Dosya okunamadı veya geçersiz format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    const stats = getDashboardStats();
    
    if (
      window.confirm(
        `⚠️ DİKKAT!\n\n` +
        `Bu işlem TÜM verileri silecektir:\n` +
        `- ${stats.totalInstructors} usta öğretici\n` +
        `- ${stats.totalPayrolls} bordro\n\n` +
        `Bu işlem geri alınamaz!\n` +
        `Devam etmek istiyor musunuz?`
      )
    ) {
      if (window.confirm('Gerçekten silmek istediğinizden emin misiniz?')) {
        clearAllData();
        showMessage('success', 'Tüm veriler silindi.');
        window.location.reload();
      }
    }
  };

  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Ayarlar</h2>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Data Stats */}
      <Card title="Veri Özeti">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
            <p className="text-sm text-gray-500">Usta Öğretici</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.totalPayrolls}</p>
            <p className="text-sm text-gray-500">Bordro</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.activeInstructors}</p>
            <p className="text-sm text-gray-500">Aktif (İşsiz)</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{stats.retiredInstructors}</p>
            <p className="text-sm text-gray-500">Emekli</p>
          </div>
        </div>
      </Card>

      {/* Export/Import */}
      <Card title="Veri Yedekleme ve Geri Yükleme">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Verileri Dışa Aktar</h3>
              <p className="text-sm text-gray-500 mb-4">
                Tüm usta öğretici ve bordro verilerini JSON dosyası olarak indirin.
                Bu dosyayı yedek olarak saklayabilirsiniz.
              </p>
              <Button onClick={handleExport}>
                📥 Verileri İndir
              </Button>
            </div>

            {/* Import */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Verileri İçe Aktar</h3>
              <p className="text-sm text-gray-500 mb-4">
                Daha önce dışa aktardığınız JSON dosyasından verileri geri yükleyin.
                Bu işlem mevcut verilerin üzerine yazacaktır.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <Button onClick={handleImport} variant="outline">
                📤 Dosya Seç ve Yükle
              </Button>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
            <p className="font-semibold mb-1">⚠️ Önemli:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Tarayıcı verilerini temizlerseniz kayıtlı bilgiler silinir.</li>
              <li>Düzenli olarak yedek almanızı öneririz.</li>
              <li>İçe aktarma mevcut verilerin üzerine yazacaktır.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Clear Data */}
      <Card title="Tehlikeli Bölge">
        <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
          <h3 className="font-semibold text-red-700 mb-2">Tüm Verileri Sil</h3>
          <p className="text-sm text-red-600 mb-4">
            Bu işlem tüm usta öğretici ve bordro verilerini kalıcı olarak silecektir.
            Bu işlem geri alınamaz!
          </p>
          <Button onClick={handleClearData} variant="danger">
            🗑️ Tüm Verileri Sil
          </Button>
        </div>
      </Card>

      {/* About */}
      <Card title="Hakkında">
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Uygulama:</strong> Halk Eğitim Bordro Sistemi</p>
          <p><strong>Versiyon:</strong> 1.0.0</p>
          <p><strong>Teknolojiler:</strong> React, TypeScript, Tailwind CSS, Vite</p>
          <p><strong>Veri Depolama:</strong> Tarayıcı LocalStorage</p>
          <p><strong>Son Güncelleme:</strong> {formatDateTime(new Date().toISOString())}</p>
        </div>
      </Card>
    </div>
  );
}
