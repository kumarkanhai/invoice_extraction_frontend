import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Upload } from 'lucide-react';
import DashboardPage from './pages/Dashboard';
import UploadPage from './pages/Upload';
import InvoicesPage from './pages/Invoices';

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      <nav className="sidebar glass">
        <div className="logo">Lumina AI</div>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/upload" className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}>
            <Upload size={20} />
            Upload
          </Link>
          <Link to="/invoices" className={`nav-link ${location.pathname === '/invoices' ? 'active' : ''}`}>
            <FileText size={20} />
            Invoices
          </Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
