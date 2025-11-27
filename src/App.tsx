import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { InstructorsPage } from './pages/InstructorsPage'
import { PayrollsPage } from './pages/PayrollsPage'
import { PayrollDetailPage } from './pages/PayrollDetailPage'
import { SGKRatesPage } from './pages/SGKRatesPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="instructors" element={<InstructorsPage />} />
          <Route path="payrolls" element={<PayrollsPage />} />
          <Route path="payrolls/:id" element={<PayrollDetailPage />} />
          <Route path="sgk-rates" element={<SGKRatesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
