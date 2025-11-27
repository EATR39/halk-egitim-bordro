import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { getDashboardStats, getPayrolls } from '../services/storage.service';
import { formatCurrency, formatPeriod } from '../utils/formatters';
import type { Payroll } from '../types';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    activeInstructors: 0,
    retiredInstructors: 0,
    totalPayrolls: 0,
    currentMonthPayrolls: 0,
    totalGrossThisMonth: 0,
    totalNetThisMonth: 0,
  });
  const [recentPayrolls, setRecentPayrolls] = useState<Payroll[]>([]);

  useEffect(() => {
    setStats(getDashboardStats());
    const payrolls = getPayrolls();
    setRecentPayrolls(
      payrolls
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    );
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gösterge Paneli</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-4xl font-bold">{stats.totalInstructors}</p>
            <p className="text-sm text-blue-100 mt-1">Toplam Usta Öğretici</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-4xl font-bold">{stats.activeInstructors}</p>
            <p className="text-sm text-green-100 mt-1">Aktif (İşsiz) Öğretici</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="text-center">
            <p className="text-4xl font-bold">{stats.retiredInstructors}</p>
            <p className="text-sm text-orange-100 mt-1">Emekli Öğretici</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <p className="text-4xl font-bold">{stats.totalPayrolls}</p>
            <p className="text-sm text-purple-100 mt-1">Toplam Bordro</p>
          </div>
        </Card>
      </div>

      {/* This Month Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Bu Ay Özeti">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Bordro Sayısı</span>
              <span className="font-semibold">{stats.currentMonthPayrolls}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Toplam Brüt</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(stats.totalGrossThisMonth)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Toplam Net</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(stats.totalNetThisMonth)}
              </span>
            </div>
          </div>
        </Card>

        <Card 
          title="Son Bordrolar"
          actions={
            <Link 
              to="/payrolls" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Tümünü Gör →
            </Link>
          }
        >
          {recentPayrolls.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Henüz bordro oluşturulmamış.
            </p>
          ) : (
            <div className="space-y-2">
              {recentPayrolls.map((payroll) => (
                <Link
                  key={payroll.id}
                  to={`/payrolls/${payroll.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {payroll.instructorName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPeriod(payroll.period)}
                      </p>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(payroll.netAmount)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Hızlı İşlemler">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/instructors"
            className="p-4 text-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span className="text-3xl">👨‍🏫</span>
            <p className="mt-2 font-medium text-blue-700">Öğretici Ekle</p>
          </Link>
          <Link
            to="/payrolls"
            className="p-4 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
          >
            <span className="text-3xl">📋</span>
            <p className="mt-2 font-medium text-green-700">Bordro Oluştur</p>
          </Link>
          <Link
            to="/sgk-rates"
            className="p-4 text-center rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <span className="text-3xl">📈</span>
            <p className="mt-2 font-medium text-orange-700">SGK Oranları</p>
          </Link>
          <Link
            to="/settings"
            className="p-4 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <span className="text-3xl">⚙️</span>
            <p className="mt-2 font-medium text-purple-700">Ayarlar</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
