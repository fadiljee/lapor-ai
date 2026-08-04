import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/warga/HomePage';
import { SubmitReportPage } from './pages/warga/SubmitReportPage';
import { EmailVerificationPage } from './pages/warga/EmailVerificationPage';
import { ReportSuccessPage } from './pages/warga/ReportSuccessPage';
import { TrackReportPage } from './pages/warga/TrackReportPage';
import { AboutLaporAiPage } from './pages/warga/AboutLaporAiPage';

import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPetugasPage } from './pages/petugas/DashboardPetugasPage';
import { RoutingManagementPage } from './pages/admin/RoutingManagementPage';
import { SLASettingsPage } from './pages/admin/SLASettingsPage';
import { AnalyticsPage } from './pages/supervisor/AnalyticsPage';
import { AuditLogPage } from './pages/auditor/AuditLogPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#F4F3EE] text-[#1A1D1F]">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Warga Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/lapor" element={<SubmitReportPage />} />
            <Route path="/verifikasi-email" element={<EmailVerificationPage />} />
            <Route path="/lapor/berhasil" element={<ReportSuccessPage />} />
            <Route path="/lacak" element={<TrackReportPage />} />
            <Route path="/tentang-lapor-ai" element={<AboutLaporAiPage />} />

            {/* Auth Route */}
            <Route path="/masuk" element={<LoginPage />} />

            {/* Staff Dashboard Routes */}
            <Route path="/dashboard/antrean" element={<DashboardPetugasPage />} />
            <Route path="/dashboard/routing" element={<RoutingManagementPage />} />
            <Route path="/dashboard/sla" element={<SLASettingsPage />} />
            <Route path="/dashboard/analitik" element={<AnalyticsPage />} />
            <Route path="/dashboard/audit-log" element={<AuditLogPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
