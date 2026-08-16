import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { LenisGsapProvider } from './providers/LenisGsapProvider';

// Pages
import { HomePage } from './pages/warga/HomePage';
import { SubmitReportPage } from './pages/warga/SubmitReportPage';
import { EmailVerificationPage } from './pages/warga/EmailVerificationPage';
import { ReportSuccessPage } from './pages/warga/ReportSuccessPage';
import { TrackReportPage } from './pages/warga/TrackReportPage';
import { AboutLaporAiPage } from './pages/warga/AboutLaporAiPage';

import { LoginPage } from './pages/auth/LoginPage';
import { DashboardIndex } from './pages/dashboard/DashboardIndex';
import { DashboardWargaPage } from './pages/warga/DashboardWargaPage';
import { DashboardPetugasPage } from './pages/petugas/DashboardPetugasPage';
import { RoutingManagementPage } from './pages/admin/RoutingManagementPage';
import { SLASettingsPage } from './pages/admin/SLASettingsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AnalyticsPage } from './pages/supervisor/AnalyticsPage';
import { AuditLogPage } from './pages/auditor/AuditLogPage';

function RoleProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem('lapor_ai_token');
  const userRole = localStorage.getItem('lapor_ai_role') || 'warga';

  if (!token) {
    return <Navigate to="/masuk" replace />;
  }

  const roleRedirectMap = {
    warga: '/dashboard/warga',
    petugas: '/dashboard/antrean',
    admin: '/dashboard/routing',
    supervisor: '/dashboard/analitik',
    auditor: '/dashboard/audit-log'
  };

  if (!allowedRoles.includes(userRole)) {
    const target = roleRedirectMap[userRole] || '/dashboard/warga';
    return <Navigate to={target} replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <LenisGsapProvider>
        <div className="flex flex-col min-h-screen bg-bg-base text-text-primary">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Info & Auth Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/verifikasi-email" element={<EmailVerificationPage />} />
              <Route path="/lapor/berhasil" element={<ReportSuccessPage />} />
              <Route path="/tentang-lapor-ai" element={<AboutLaporAiPage />} />
              <Route path="/masuk" element={<LoginPage />} />

              {/* Warga Only Protected Routes */}
              <Route
                path="/lapor"
                element={
                  <RoleProtectedRoute allowedRoles={['warga']}>
                    <SubmitReportPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/lacak"
                element={
                  <RoleProtectedRoute allowedRoles={['warga']}>
                    <TrackReportPage />
                  </RoleProtectedRoute>
                }
              />

              {/* Role Dashboard Routes (Strictly Isolated per Role) */}
              <Route path="/dashboard" element={<DashboardIndex />} />
              <Route
                path="/dashboard/warga"
                element={
                  <RoleProtectedRoute allowedRoles={['warga']}>
                    <DashboardWargaPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dashboard/antrean"
                element={
                  <RoleProtectedRoute allowedRoles={['petugas']}>
                    <DashboardPetugasPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dashboard/routing"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <RoutingManagementPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dashboard/sla"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <SLASettingsPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <UserManagementPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analitik"
                element={
                  <RoleProtectedRoute allowedRoles={['supervisor']}>
                    <AnalyticsPage />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/dashboard/audit-log"
                element={
                  <RoleProtectedRoute allowedRoles={['auditor']}>
                    <AuditLogPage />
                  </RoleProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </LenisGsapProvider>
    </BrowserRouter>
  );
}
