import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { LenisGsapProvider } from './providers/LenisGsapProvider';

import { HomePage } from './pages/warga/HomePage';
import { SubmitReportPage } from './pages/warga/SubmitReportPage';
import { EmailVerificationPage } from './pages/warga/EmailVerificationPage';
import { ReportSuccessPage } from './pages/warga/ReportSuccessPage';
import { TrackReportPage } from './pages/warga/TrackReportPage';
import { AboutLaporAiPage } from './pages/warga/AboutLaporAiPage';
import { ContactPage } from './pages/warga/ContactPage';

import { LoginPage } from './pages/auth/LoginPage';
import { DashboardIndex } from './pages/dashboard/DashboardIndex';
import { DashboardWargaPage } from './pages/warga/DashboardWargaPage';
import { DashboardPetugasPage } from './pages/petugas/DashboardPetugasPage';
import { RoutingManagementPage } from './pages/admin/RoutingManagementPage';
import { DashboardDinasPage } from './pages/admin/DashboardDinasPage';
import { SLASettingsPage } from './pages/admin/SLASettingsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';
import { InstansiManagementPage } from './pages/admin/InstansiManagementPage';

function RoleProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem('lapor_ai_token');
  const userRole = localStorage.getItem('lapor_ai_role') || 'warga';

  if (!token) {
    return <Navigate to="/masuk" replace />;
  }

  const roleRedirectMap = {
    warga: '/dashboard/warga',
    petugas: '/dashboard/antrean',
    dinas: '/dashboard/tugas-dinas',
    admin: '/dashboard/routing'
  };

  if (!allowedRoles.includes(userRole)) {
    const target = roleRedirectMap[userRole] || '/dashboard/warga';
    return <Navigate to={target} replace />;
  }

  return children;
}

import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-text-primary">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AboutLaporAiPage />} />
          <Route path="/verifikasi-email" element={<EmailVerificationPage />} />
          <Route path="/dashboard/lapor/berhasil" element={<ReportSuccessPage />} />
          <Route path="/tentang-lapor-ai" element={<AboutLaporAiPage />} />
          <Route path="/hubungi-kami" element={<ContactPage />} />
          <Route path="/masuk" element={<LoginPage />} />

          <Route
            path="/dashboard/lapor"
            element={
              <RoleProtectedRoute allowedRoles={['warga']}>
                <SubmitReportPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lacak"
            element={
              <RoleProtectedRoute allowedRoles={['warga']}>
                <TrackReportPage />
              </RoleProtectedRoute>
            }
          />

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
            path="/dashboard/tugas-dinas"
            element={
              <RoleProtectedRoute allowedRoles={['dinas']}>
                <DashboardDinasPage />
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
            path="/dashboard/manajemen-user"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <UserManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/dashboard/manajemen-instansi"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <InstansiManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analitik"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AnalyticsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/dashboard/audit-log"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AuditLogPage />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LenisGsapProvider>
        <AppContent />
      </LenisGsapProvider>
    </BrowserRouter>
  );
}
