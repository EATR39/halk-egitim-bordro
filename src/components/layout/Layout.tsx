import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Gösterge Paneli', icon: '📊' },
  { path: '/instructors', label: 'Usta Öğreticiler', icon: '👨‍🏫' },
  { path: '/payrolls', label: 'Bordrolar', icon: '📋' },
  { path: '/sgk-rates', label: 'SGK Oranları', icon: '📈' },
  { path: '/settings', label: 'Ayarlar', icon: '⚙️' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏛️</span>
              <div>
                <h1 className="text-xl font-bold">Halk Eğitim Bordro Sistemi</h1>
                <p className="text-sm text-blue-200">Usta Öğretici Bordro Yönetimi</p>
              </div>
            </div>
            <div className="text-sm text-blue-200">
              {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm print:hidden">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 mt-auto print:hidden">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2024 Halk Eğitim Bordro Sistemi - Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
