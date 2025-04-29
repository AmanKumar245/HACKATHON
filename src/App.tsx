import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ReportPage from './pages/ReportPage';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import ReportDetail from './pages/department/ReportDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/department" element={<DepartmentDashboard />} />
        <Route path="/department/report/:id" element={<ReportDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;