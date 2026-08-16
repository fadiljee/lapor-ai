import React from 'react';
import { Navigate } from 'react-router-dom';

export function DashboardIndex() {
  const role = localStorage.getItem('lapor_ai_role') || 'warga';

  const roleRedirectMap = {
    warga: '/dashboard/warga',
    petugas: '/dashboard/antrean',
    dinas: '/dashboard/tugas-dinas',
    admin: '/dashboard/routing'
  };

  const targetPath = roleRedirectMap[role] || '/dashboard/antrean';
  return <Navigate to={targetPath} replace />;
}
