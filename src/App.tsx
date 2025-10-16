// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import Overview from './pages/dashboard/Overview';
import Invoices from './pages/dashboard/Invoices';
import Tasks from './pages/dashboard/Tasks';
import MezoDashboard from './pages/dashboard/MezoDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import { AuthProvider } from './contexts/AuthContext';
import { MezoProvider } from './providers/MezoProvider';
import { MezoPassportProvider } from './providers/MezoPassportProvider';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <MezoPassportProvider>
            <AuthProvider>
              <MezoProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<Overview />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="mezo" element={<MezoDashboard />} />
              <Route path="profile" element={<div>Profile Page</div>} />
            </Route>
          </Routes>
              </MezoProvider>
            </AuthProvider>
          </MezoPassportProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;