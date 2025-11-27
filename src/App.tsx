import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { PayrollsPage, PayrollDetailPage } from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold">
                📋 Halk Eğitim Bordro Sistemi
              </Link>
              <nav>
                <Link to="/payrolls" className="hover:text-blue-200 transition">
                  Bordrolar
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/payrolls" replace />} />
            <Route path="/payrolls" element={<PayrollsPage />} />
            <Route path="/payrolls/:id" element={<PayrollDetailPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          <p>© 2025 Halk Eğitim Bordro Sistemi - MEB 2025 Ek Ders Ücretleri</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
